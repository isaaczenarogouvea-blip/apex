import { useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import {
  getActivePunishments,
  completePunishment as completePunishmentDB,
} from '../db/punishmentRepository';

export function usePunishment() {
  const activePunishments = useAppStore((s) => s.activePunishments);
  const setActivePunishments = useAppStore((s) => s.setActivePunishments);

  const loadPunishments = useCallback(async () => {
    try {
      const db = await getDatabase();
      const punishments = await getActivePunishments(db);
      setActivePunishments(
        punishments.map((p) => ({
          id: p.id,
          label: p.label,
          exercises: JSON.stringify(p.exercises),
          dueDate: p.dueDate,
          shameMessage: p.shameMessage,
        }))
      );
    } catch (error) {
      console.error('Failed to load punishments:', error);
    }
  }, [setActivePunishments]);

  const completePunishment = useCallback(
    async (id: number) => {
      try {
        const db = await getDatabase();
        await completePunishmentDB(db, id);
        setActivePunishments(activePunishments.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Failed to complete punishment:', error);
      }
    },
    [activePunishments, setActivePunishments]
  );

  return { activePunishments, loadPunishments, completePunishment };
}
