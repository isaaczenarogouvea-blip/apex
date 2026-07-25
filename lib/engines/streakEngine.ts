import * as SQLite from 'expo-sqlite';

import { GOALS } from '../../constants/goals';
import { DayStatus } from '../../constants/notifications';
import { getConsecutiveBadDays } from '../db/scoreRepository';

const STREAK_TYPE = 'daily';

interface StreakRow {
  id: number;
  type: string;
  current_count: number;
  best_count: number;
  last_date: string | null;
}

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

async function getOrCreateStreak(
  db: SQLite.SQLiteDatabase,
  type: string
): Promise<StreakRow> {
  const existing = await db.getFirstAsync<StreakRow>(
    `SELECT * FROM streaks WHERE type = ?;`,
    [type]
  );
  if (existing) {
    return existing;
  }

  await db.runAsync(
    `INSERT INTO streaks (type, current_count, best_count, last_date) VALUES (?, 0, 0, NULL);`,
    [type]
  );

  const created = await db.getFirstAsync<StreakRow>(
    `SELECT * FROM streaks WHERE type = ?;`,
    [type]
  );

  // Guaranteed to exist immediately after the insert above.
  return created as StreakRow;
}

/**
 * Reads the current daily streak without mutating it. Use this for display
 * purposes (e.g. on every screen focus); only `updateStreak` should ever
 * advance or reset the count, and only once per finalized day.
 */
export async function getStreak(db: SQLite.SQLiteDatabase): Promise<StreakResult> {
  const streak = await getOrCreateStreak(db, STREAK_TYPE);
  return { currentStreak: streak.current_count, bestStreak: streak.best_count };
}

/**
 * Advances (or resets) the running daily streak based on the outcome of
 * `date`. 'elite'/'good' days extend the streak; 'average'/'bad' days break
 * it. best_count is a high-water mark that only ever grows.
 */
export async function updateStreak(
  db: SQLite.SQLiteDatabase,
  date: string,
  dayStatus: DayStatus
): Promise<StreakResult> {
  const streak = await getOrCreateStreak(db, STREAK_TYPE);

  let currentCount = streak.current_count;

  if (dayStatus === 'elite' || dayStatus === 'good') {
    currentCount += 1;
  } else {
    currentCount = 0;
  }

  const bestCount = Math.max(streak.best_count, currentCount);

  await db.runAsync(
    `UPDATE streaks SET current_count = ?, best_count = ?, last_date = ? WHERE id = ?;`,
    [currentCount, bestCount, date, streak.id]
  );

  return { currentStreak: currentCount, bestStreak: bestCount };
}

/**
 * True when the last GOALS.shameConsecutiveDays days, ending at (and
 * including) `date`, were all scored as 'bad'.
 */
export async function checkShameCondition(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<boolean> {
  const consecutiveBadDays = await getConsecutiveBadDays(db, date);
  return consecutiveBadDays >= GOALS.shameConsecutiveDays;
}
