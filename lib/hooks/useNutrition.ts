import { useState, useCallback, useMemo } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import {
  getMealLogsForDate,
  toggleMealEaten,
  logWeight as logWeightDB,
  getWeightHistory as getWeightHistoryDB,
} from '../db/nutritionRepository';
import { toggleHabit } from '../db/habitsRepository';
import { calculateDailyScore } from '../engines/scoreEngine';
import { PRESET_MEALS, PresetMeal, DAILY_CALORIE_GOAL } from '../../constants/meals';

interface WeightRecord {
  date: string;
  weightKg: number;
}

export function useNutrition() {
  const todayDate = useAppStore((s) => s.todayDate);
  const mealLogs = useAppStore((s) => s.mealLogs);
  const setMealLogs = useAppStore((s) => s.setMealLogs);
  const toggleMealLog = useAppStore((s) => s.toggleMealLog);
  const setScore = useAppStore((s) => s.setScore);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);

  const loadMeals = useCallback(async () => {
    try {
      const db = await getDatabase();
      const logs = await getMealLogsForDate(db, todayDate);
      const logsMap: Record<string, boolean> = {};
      for (const log of logs) {
        logsMap[log.mealId] = log.eaten;
      }
      setMealLogs(logsMap);
    } catch (error) {
      console.error('Failed to load meals:', error);
    }
  }, [todayDate, setMealLogs]);

  const toggleMeal = useCallback(
    async (mealId: string, eaten: boolean) => {
      try {
        toggleMealLog(mealId, eaten);
        const db = await getDatabase();
        await toggleMealEaten(db, todayDate, mealId, eaten);

        const updatedLogs = { ...mealLogs, [mealId]: eaten };
        const totalCal = PRESET_MEALS.reduce(
          (sum, m) => sum + (updatedLogs[m.id] ? m.kcal : 0),
          0
        );

        if (totalCal >= DAILY_CALORIE_GOAL) {
          await toggleHabit(db, 'calorie_goal', todayDate, true);
          const result = await calculateDailyScore(db, todayDate);
          setScore({
            pointsEarned: result.pointsEarned,
            scorePercent: result.scorePercent,
            dayStatus: result.dayStatus,
          });
        }
      } catch (error) {
        console.error('Failed to toggle meal:', error);
        toggleMealLog(mealId, !eaten);
      }
    },
    [todayDate, mealLogs, toggleMealLog, setScore]
  );

  const totalCalories = useMemo(
    () => PRESET_MEALS.reduce((sum, m) => sum + (mealLogs[m.id] ? m.kcal : 0), 0),
    [mealLogs]
  );

  const totalProtein = useMemo(
    () => PRESET_MEALS.reduce((sum, m) => sum + (mealLogs[m.id] ? m.protein : 0), 0),
    [mealLogs]
  );

  const logWeight = useCallback(
    async (weightKg: number) => {
      try {
        const db = await getDatabase();
        await logWeightDB(db, todayDate, weightKg);
        setWeightHistory((prev) => {
          const updated = prev.filter((w) => w.date !== todayDate);
          return [{ date: todayDate, weightKg }, ...updated];
        });
      } catch (error) {
        console.error('Failed to log weight:', error);
      }
    },
    [todayDate]
  );

  const loadWeightHistory = useCallback(async () => {
    try {
      const db = await getDatabase();
      const history = await getWeightHistoryDB(db, 30);
      setWeightHistory(
        history.map((h) => ({
          date: h.date,
          weightKg: h.weightKg,
        }))
      );
    } catch (error) {
      console.error('Failed to load weight history:', error);
    }
  }, []);

  const meals: PresetMeal[] = useMemo(() => PRESET_MEALS, []);

  return {
    meals,
    mealLogs,
    toggleMeal,
    loadMeals,
    totalCalories,
    totalProtein,
    weightHistory,
    logWeight,
    loadWeightHistory,
  };
}
