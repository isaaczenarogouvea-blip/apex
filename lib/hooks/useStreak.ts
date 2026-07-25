import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import { checkShameCondition } from '../engines/streakEngine';

export function useStreak() {
  const todayDate = useAppStore((s) => s.todayDate);
  const streak = useAppStore((s) => s.streak);
  const setStreak = useAppStore((s) => s.setStreak);
  const [isShameCondition, setIsShameCondition] = useState(false);

  const loadStreak = useCallback(async () => {
    try {
      const db = await getDatabase();

      const row = await db.getFirstAsync<{
        current_count: number;
        best_count: number;
      }>(`SELECT current_count, best_count FROM streaks WHERE type = 'daily' LIMIT 1;`);

      if (row) {
        setStreak({
          currentStreak: row.current_count,
          bestStreak: row.best_count,
        });
      }

      const shame = await checkShameCondition(db, todayDate);
      setIsShameCondition(shame);
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  }, [todayDate, setStreak]);

  return {
    currentStreak: streak.currentStreak,
    bestStreak: streak.bestStreak,
    loadStreak,
    isShameCondition,
  };
}
