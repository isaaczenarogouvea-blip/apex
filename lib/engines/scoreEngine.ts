import * as SQLite from 'expo-sqlite';

import { HABITS, TOTAL_POSSIBLE_POINTS } from '../../constants/habits';
import { GOALS } from '../../constants/goals';
import { DayStatus } from '../../constants/notifications';
import { FAILURE_WEIGHT_MAP } from '../../constants/punishments';
import { getHabitLogsForDate } from '../db/habitsRepository';
import { upsertScore } from '../db/scoreRepository';
import { evaluateAndCreatePunishment, PunishmentEvaluationResult } from './punishmentEngine';

export interface DailyScoreResult {
  pointsEarned: number;
  scorePercent: number;
  dayStatus: DayStatus;
  failureCount: number;
  weightedFailureCount: number;
}

export interface FinalizeDayResult extends DailyScoreResult {
  punishment: PunishmentEvaluationResult | null;
}

/**
 * Determines the qualitative bucket for a given score percentage, using the
 * thresholds defined in constants/goals.ts.
 */
function resolveDayStatus(scorePercent: number): DayStatus {
  if (scorePercent >= GOALS.eliteThreshold) return 'elite';
  if (scorePercent >= GOALS.goodThreshold) return 'good';
  if (scorePercent >= GOALS.averageThreshold) return 'average';
  return 'bad';
}

/** Pure derivation of the score from the raw habit_logs rows (no persistence). */
async function computeScore(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<DailyScoreResult> {
  const habitLogs = await getHabitLogsForDate(db, date);
  const completedHabitIds = new Set(
    habitLogs.filter((log) => log.completed).map((log) => log.habitId)
  );

  let pointsEarned = 0;
  let failureCount = 0;
  let weightedFailureCount = 0;

  for (const habit of HABITS) {
    if (completedHabitIds.has(habit.id)) {
      pointsEarned += habit.points;
    } else {
      failureCount += 1;
      weightedFailureCount += FAILURE_WEIGHT_MAP[habit.weight];
    }
  }

  const scorePercent = (pointsEarned / TOTAL_POSSIBLE_POINTS) * 100;
  const dayStatus = resolveDayStatus(scorePercent);

  return { pointsEarned, scorePercent, dayStatus, failureCount, weightedFailureCount };
}

/**
 * Recomputes the score for `date` from the raw habit_logs rows and persists
 * it to daily_scores (as not-yet-finalized). Safe to call multiple times per
 * day (e.g. every time a habit is toggled) since it's a pure re-derivation
 * followed by an upsert.
 */
export async function calculateDailyScore(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<DailyScoreResult> {
  const score = await computeScore(db, date);

  await upsertScore(
    db,
    date,
    score.pointsEarned,
    TOTAL_POSSIBLE_POINTS,
    score.scorePercent,
    score.failureCount,
    score.weightedFailureCount,
    score.dayStatus,
    false
  );

  return score;
}

/**
 * Closes out the day: recomputes the score, triggers a punishment when the
 * day was bad enough, and persists the daily_scores row with finalized=true
 * so it's no longer treated as "in progress".
 */
export async function finalizeDay(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<FinalizeDayResult> {
  const score = await computeScore(db, date);

  let punishment: PunishmentEvaluationResult | null = null;
  if (score.dayStatus === 'bad') {
    punishment = await evaluateAndCreatePunishment(db, date, score.weightedFailureCount);
  }

  await upsertScore(
    db,
    date,
    score.pointsEarned,
    TOTAL_POSSIBLE_POINTS,
    score.scorePercent,
    score.failureCount,
    score.weightedFailureCount,
    score.dayStatus,
    true
  );

  return { ...score, punishment };
}
