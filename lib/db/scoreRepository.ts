import { format, parseISO, subDays } from 'date-fns';
import * as SQLite from 'expo-sqlite';

import { TOTAL_POSSIBLE_POINTS } from '../../constants/habits';
import { GOALS } from '../../constants/goals';
import { DayStatus } from '../../constants/notifications';

/** Public shape of a daily score, as consumed by the rest of the app. */
export interface DailyScoreRecord {
  id: number;
  date: string;
  pointsEarned: number;
  pointsPossible: number;
  scorePercent: number;
  failureCount: number;
  weightedFailureCount: number;
  dayStatus: string;
  finalized: boolean;
}

/** Raw shape of a row in the `daily_scores` table. */
interface DailyScoreRow {
  id: number;
  date: string;
  points_earned: number;
  points_possible: number;
  score_percent: number;
  failure_count: number;
  weighted_failure_count: number;
  day_status: string;
  finalized: number;
}

function rowToRecord(row: DailyScoreRow): DailyScoreRecord {
  return {
    id: row.id,
    date: row.date,
    pointsEarned: row.points_earned,
    pointsPossible: row.points_possible,
    scorePercent: row.score_percent,
    failureCount: row.failure_count,
    weightedFailureCount: row.weighted_failure_count,
    dayStatus: row.day_status,
    finalized: row.finalized === 1,
  };
}

/**
 * Gets the daily_scores row for `date`, creating a fresh "pending" row
 * (with the full TOTAL_POSSIBLE_POINTS as points_possible) if none exists yet.
 */
export async function getScoreForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<DailyScoreRecord> {
  const existing = await db.getFirstAsync<DailyScoreRow>(
    `SELECT * FROM daily_scores WHERE date = ?;`,
    [date]
  );
  if (existing) {
    return rowToRecord(existing);
  }

  await db.runAsync(
    `INSERT INTO daily_scores
       (date, points_earned, points_possible, score_percent, failure_count, weighted_failure_count, day_status, finalized)
     VALUES (?, 0, ?, 0, 0, 0, 'pending', 0)
     ON CONFLICT(date) DO NOTHING;`,
    [date, TOTAL_POSSIBLE_POINTS]
  );

  const created = await db.getFirstAsync<DailyScoreRow>(
    `SELECT * FROM daily_scores WHERE date = ?;`,
    [date]
  );
  // created is guaranteed to exist: we just inserted it (or a concurrent
  // caller did, in which case ON CONFLICT DO NOTHING left theirs in place).
  return rowToRecord(created as DailyScoreRow);
}

/**
 * Inserts or updates the daily_scores row for `date` with a full recalculation.
 */
export async function upsertScore(
  db: SQLite.SQLiteDatabase,
  date: string,
  pointsEarned: number,
  pointsPossible: number,
  scorePercent: number,
  failureCount: number,
  weightedFailureCount: number,
  dayStatus: DayStatus | string,
  finalized: boolean
): Promise<void> {
  await db.runAsync(
    `INSERT INTO daily_scores
       (date, points_earned, points_possible, score_percent, failure_count, weighted_failure_count, day_status, finalized)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       points_earned = excluded.points_earned,
       points_possible = excluded.points_possible,
       score_percent = excluded.score_percent,
       failure_count = excluded.failure_count,
       weighted_failure_count = excluded.weighted_failure_count,
       day_status = excluded.day_status,
       finalized = excluded.finalized;`,
    [
      date,
      pointsEarned,
      pointsPossible,
      scorePercent,
      failureCount,
      weightedFailureCount,
      dayStatus,
      finalized ? 1 : 0,
    ]
  );
}

/**
 * Fetches daily_scores rows for every date in [startDate, endDate] (inclusive)
 * that actually have a recorded score, ordered chronologically.
 */
export async function getScoresForRange(
  db: SQLite.SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<DailyScoreRecord[]> {
  const rows = await db.getAllAsync<DailyScoreRow>(
    `SELECT * FROM daily_scores WHERE date BETWEEN ? AND ? ORDER BY date ASC;`,
    [startDate, endDate]
  );
  return rows.map(rowToRecord);
}

/**
 * Counts how many consecutive days end at (and include) `fromDate` with a
 * score_percent below the shame threshold (50%). Walks backwards day-by-day
 * and stops at the first day that is missing a score or is >= the threshold.
 */
export async function getConsecutiveBadDays(
  db: SQLite.SQLiteDatabase,
  fromDate: string
): Promise<number> {
  const threshold = GOALS.shameScoreThreshold;
  const MAX_LOOKBACK_DAYS = 3650; // ~10 years, safety bound against runaway loops

  let count = 0;
  let cursor = fromDate;

  for (let i = 0; i < MAX_LOOKBACK_DAYS; i++) {
    const row = await db.getFirstAsync<DailyScoreRow>(
      `SELECT * FROM daily_scores WHERE date = ?;`,
      [cursor]
    );
    if (!row || row.score_percent >= threshold) {
      break;
    }
    count += 1;
    cursor = format(subDays(parseISO(cursor), 1), 'yyyy-MM-dd');
  }

  return count;
}
