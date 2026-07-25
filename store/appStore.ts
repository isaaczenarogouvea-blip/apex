import { format } from 'date-fns';
import { create } from 'zustand';

interface ScoreSummary {
  pointsEarned: number;
  scorePercent: number;
  dayStatus: string;
}

interface StreakSummary {
  currentStreak: number;
  bestStreak: number;
}

interface ActivePunishment {
  id: number;
  label: string;
  exercises: string;
  dueDate: string;
  shameMessage: string;
}

export interface AppState {
  todayDate: string;
  score: ScoreSummary | null;
  habitLogs: Record<string, boolean>;
  streak: StreakSummary;
  activePunishments: ActivePunishment[];
  mealLogs: Record<string, boolean>;
  isLoading: boolean;

  setTodayDate: (date: string) => void;
  setScore: (score: AppState['score']) => void;
  setHabitLogs: (logs: Record<string, boolean>) => void;
  toggleHabitLog: (habitId: string, completed: boolean) => void;
  setStreak: (streak: AppState['streak']) => void;
  setActivePunishments: (punishments: AppState['activePunishments']) => void;
  setMealLogs: (logs: Record<string, boolean>) => void;
  toggleMealLog: (mealId: string, eaten: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  todayDate: format(new Date(), 'yyyy-MM-dd'),
  score: null,
  habitLogs: {},
  streak: { currentStreak: 0, bestStreak: 0 },
  activePunishments: [],
  mealLogs: {},
  isLoading: false,

  setTodayDate: (date) => set({ todayDate: date }),

  setScore: (score) => set({ score }),

  setHabitLogs: (logs) => set({ habitLogs: logs }),

  toggleHabitLog: (habitId, completed) =>
    set((state) => ({
      habitLogs: { ...state.habitLogs, [habitId]: completed },
    })),

  setStreak: (streak) => set({ streak }),

  setActivePunishments: (punishments) => set({ activePunishments: punishments }),

  setMealLogs: (logs) => set({ mealLogs: logs }),

  toggleMealLog: (mealId, eaten) =>
    set((state) => ({
      mealLogs: { ...state.mealLogs, [mealId]: eaten },
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),
}));
