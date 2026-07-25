import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import { calculateDailyScore, finalizeDay } from '../engines/scoreEngine';
import { getScoresForRange, DailyScoreRecord } from '../db/scoreRepository';
import { updateStreak } from '../engines/streakEngine';
import { DayStatus } from '../../constants/notifications';
import { sendEndOfDayNotification } from '../notifications/notificationService';
import { format, subDays } from 'date-fns';

interface WeekScore {
  date: string;
  scorePercent: number;
  dayStatus: string;
}

export function useScore() {
  const todayDate = useAppStore((s) => s.todayDate);
  const score = useAppStore((s) => s.score);
  const setScore = useAppStore((s) => s.setScore);
  const setStreak = useAppStore((s) => s.setStreak);
  const setActivePunishments = useAppStore((s) => s.setActivePunishments);
  const [weekScores, setWeekScores] = useState<WeekScore[]>([]);

  const loadScore = useCallback(async () => {
    try {
      const db = await getDatabase();
      const result = await calculateDailyScore(db, todayDate);
      setScore({
        pointsEarned: result.pointsEarned,
        scorePercent: result.scorePercent,
        dayStatus: result.dayStatus,
      });
    } catch (error) {
      console.error('Failed to load score:', error);
    }
  }, [todayDate, setScore]);

  const loadWeekScores = useCallback(async () => {
    try {
      const db = await getDatabase();
      const endDate = todayDate;
      const startDate = format(subDays(new Date(), 6), 'yyyy-MM-dd');
      const scores = await getScoresForRange(db, startDate, endDate);
      setWeekScores(
        scores.map((s: DailyScoreRecord) => ({
          date: s.date,
          scorePercent: s.scorePercent,
          dayStatus: s.dayStatus,
        }))
      );
    } catch (error) {
      console.error('Failed to load week scores:', error);
    }
  }, [todayDate]);

  const finalize = useCallback(async () => {
    try {
      const db = await getDatabase();
      const result = await finalizeDay(db, todayDate);
      setScore({
        pointsEarned: result.pointsEarned,
        scorePercent: result.scorePercent,
        dayStatus: result.dayStatus,
      });

      const streakResult = await updateStreak(db, todayDate, result.dayStatus);
      setStreak(streakResult);

      if (result.punishment && result.punishment.created) {
        const { getActivePunishments } = await import('../db/punishmentRepository');
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
      }

      await sendEndOfDayNotification(result.dayStatus);
    } catch (error) {
      console.error('Failed to finalize day:', error);
    }
  }, [todayDate, setScore, setStreak, setActivePunishments]);

  return { score, loadScore, finalizeDay: finalize, weekScores, loadWeekScores };
}
