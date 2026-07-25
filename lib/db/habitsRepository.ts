import { differenceInCalendarDays, parseISO } from 'date-fns';
import * as SQLite from 'expo-sqlite';

/** Public shape of a habit log, as consumed by the rest of the app. */
export interface HabitLogRecord {
  id: number;
  habitId: string;
  date: string;
  completed: boolean;
  completedAt: string | null;
}

/** Raw shape of a row in the `habit_logs` table. */
interface HabitLogRow {
  id: number;
  habit_id: string;
  date: string;
  completed: number;
  completed_at: string | null;
}

function rowToRecord(row: HabitLogRow): HabitLogRecord {
  return {
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
}

/**
 * Fetches every habit_logs row recorded for the given date.
 */
export async function getHabitLogsForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<HabitLogRecord[]> {
  const rows = await db.getAllAsync<HabitLogRow>(
    `SELECT * FROM habit_logs WHERE date = ? ORDER BY habit_id ASC;`,
    [date]
  );
  return rows.map(rowToRecord);
}

/**
 * Marks a habit as completed (or not) for a given date.
 * Uses INSERT OR REPLACE keyed on the (habit_id, date) UNIQUE constraint,
 * so calling this repeatedly for the same habit/date simply overwrites the log.
 */
export async function toggleHabit(
  db: SQLite.SQLiteDatabase,
  habitId: string,
  date: string,
  completed: boolean
): Promise<void> {
  const completedAt = completed ? new Date().toISOString() : null;
  await db.runAsync(
    `INSERT OR REPLACE INTO habit_logs (habit_id, date, completed, completed_at)
     VALUES (?, ?, ?, ?);`,
    [habitId, date, completed ? 1 : 0, completedAt]
  );
}

/**
 * Computes the percentage of days within [startDate, endDate] (inclusive)
 * on which the given habit was marked completed. The denominator is the
 * number of calendar days in the range (not just rows present), so days
 * with no log at all count as "not completed".
 */
export async function getHabitCompletionRate(
  db: SQLite.SQLiteDatabase,
  habitId: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const totalDays = differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;
  if (totalDays <= 0) {
    return 0;
  }

  const row = await db.getFirstAsync<{ completed_count: number }>(
    `SELECT COUNT(*) as completed_count
     FROM habit_logs
     WHERE habit_id = ? AND date BETWEEN ? AND ? AND completed = 1;`,
    [habitId, startDate, endDate]
  );

  const completedCount = row?.completed_count ?? 0;
  return (completedCount / totalDays) * 100;
}
