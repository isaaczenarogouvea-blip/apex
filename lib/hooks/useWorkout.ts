import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { getDatabase } from '../db/database';
import {
  createWorkoutSession,
  getSessionForDate,
  completeSession as completeSessionDB,
  upsertWorkoutSet,
  getSetsForSession,
} from '../db/workoutRepository';
import { toggleHabit } from '../db/habitsRepository';
import { calculateDailyScore } from '../engines/scoreEngine';
import { format } from 'date-fns';

interface SetData {
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

interface SessionData {
  id: number;
  workoutDay: string;
  completed: boolean;
}

export function useWorkout() {
  const todayDate = useAppStore((s) => s.todayDate);
  const setScore = useAppStore((s) => s.setScore);
  const [selectedDay, setSelectedDay] = useState('A');
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [sets, setSets] = useState<SetData[]>([]);

  const loadSession = useCallback(async () => {
    try {
      const db = await getDatabase();
      const session = await getSessionForDate(db, todayDate);
      if (session) {
        setActiveSession({
          id: session.id,
          workoutDay: session.workoutDay,
          completed: session.completed,
        });
        setSelectedDay(session.workoutDay);
        const sessionSets = await getSetsForSession(db, session.id);
        setSets(
          sessionSets.map((s) => ({
            exerciseId: s.exerciseId,
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
            completed: s.completed,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  }, [todayDate]);

  const startSession = useCallback(
    async (workoutDayId: string) => {
      try {
        const db = await getDatabase();
        const id = await createWorkoutSession(db, todayDate, workoutDayId);
        setActiveSession({ id, workoutDay: workoutDayId, completed: false });
        setSets([]);
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    },
    [todayDate]
  );

  const logSet = useCallback(
    async (exerciseId: string, setNumber: number, weightKg: number, reps: number) => {
      if (!activeSession) return;
      try {
        const db = await getDatabase();
        await upsertWorkoutSet(db, activeSession.id, exerciseId, setNumber, weightKg, reps);
        setSets((prev) => {
          const existing = prev.findIndex(
            (s) => s.exerciseId === exerciseId && s.setNumber === setNumber
          );
          const newSet: SetData = { exerciseId, setNumber, weightKg, reps, completed: true };
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newSet;
            return updated;
          }
          return [...prev, newSet];
        });
      } catch (error) {
        console.error('Failed to log set:', error);
      }
    },
    [activeSession]
  );

  const completeSession = useCallback(async () => {
    if (!activeSession) return;
    try {
      const db = await getDatabase();
      await completeSessionDB(db, activeSession.id);
      setActiveSession((prev) => (prev ? { ...prev, completed: true } : null));

      await toggleHabit(db, 'gym', todayDate, true);
      const result = await calculateDailyScore(db, todayDate);
      setScore({
        pointsEarned: result.pointsEarned,
        scorePercent: result.scorePercent,
        dayStatus: result.dayStatus,
      });
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  }, [activeSession, todayDate, setScore]);

  return {
    selectedDay,
    setSelectedDay,
    activeSession,
    sets,
    startSession,
    logSet,
    completeSession,
    loadSession,
  };
}
