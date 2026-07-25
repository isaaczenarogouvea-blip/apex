import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import { checkShameCondition, getStreak } from '../engines/streakEngine';

export function useStreak() {
  const todayDate = useAppStore((s) => s.todayDate);
  const streak = useAppStore((s) => s.streak);
  const setStreak = useAppStore((s) => s.setStreak);
  const [isShameCondition, setIsShameCondition] = useState(false);

  const loadStreak = useCallback(async () => {
    try {
      const db = await getDatabase();

      const result = await getStreak(db);
      setStreak(result);

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
