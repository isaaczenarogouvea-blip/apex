import { useCallback, useMemo } from 'react';
import { HABITS, HabitDefinition } from '../../constants/habits';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import { getHabitLogsForDate, toggleHabit as toggleHabitDB } from '../db/habitsRepository';
import { calculateDailyScore } from '../engines/scoreEngine';

export function useHabits() {
  const todayDate = useAppStore((s) => s.todayDate);
  const habitLogs = useAppStore((s) => s.habitLogs);
  const setHabitLogs = useAppStore((s) => s.setHabitLogs);
  const toggleHabitLog = useAppStore((s) => s.toggleHabitLog);
  const setScore = useAppStore((s) => s.setScore);
  const isLoading = useAppStore((s) => s.isLoading);
  const setIsLoading = useAppStore((s) => s.setIsLoading);

  const loadHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      const db = await getDatabase();
      const logs = await getHabitLogsForDate(db, todayDate);
      const logsMap: Record<string, boolean> = {};
      for (const log of logs) {
        logsMap[log.habitId] = log.completed;
      }
      setHabitLogs(logsMap);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  }, [todayDate, setHabitLogs, setIsLoading]);

  const toggleHabit = useCallback(
    async (habitId: string, completed: boolean) => {
      try {
        toggleHabitLog(habitId, completed);
        const db = await getDatabase();
        await toggleHabitDB(db, habitId, todayDate, completed);
        const result = await calculateDailyScore(db, todayDate);
        setScore({
          pointsEarned: result.pointsEarned,
          scorePercent: result.scorePercent,
          dayStatus: result.dayStatus,
        });
      } catch (error) {
        console.error('Failed to toggle habit:', error);
        toggleHabitLog(habitId, !completed);
      }
    },
    [todayDate, toggleHabitLog, setScore]
  );

  const habits: HabitDefinition[] = useMemo(() => HABITS, []);

  return { habits, habitLogs, toggleHabit, loadHabits, isLoading };
}
