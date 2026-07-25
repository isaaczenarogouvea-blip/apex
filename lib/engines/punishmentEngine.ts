import { addDays, format, parseISO } from 'date-fns';
import * as SQLite from 'expo-sqlite';

import { getPunishmentForFailures, PunishmentExercise } from '../../constants/punishments';
import { createPunishment } from '../db/punishmentRepository';

export interface PunishmentEvaluationResult {
  level: number;
  label: string;
  shameMessage: string;
  exercises: PunishmentExercise[];
  /** True when a physical punishment row was actually persisted (level > 0). */
  created: boolean;
  punishmentId: number | null;
  dueDate: string;
  sourceDate: string;
}

/**
 * Looks up the punishment tier for the given weighted failure count and, if
 * it's more than a mere alert (level > 0), persists a punishment record due
 * the following day. Always returns the tier info so callers (e.g. the
 * end-of-day summary UI) can show the shame message even for level 0.
 */
export async function evaluateAndCreatePunishment(
  db: SQLite.SQLiteDatabase,
  date: string,
  weightedFailureCount: number
): Promise<PunishmentEvaluationResult> {
  const punishmentLevel = getPunishmentForFailures(weightedFailureCount);
  const dueDate = format(addDays(parseISO(date), 1), 'yyyy-MM-dd');

  let punishmentId: number | null = null;

  if (punishmentLevel.level > 0) {
    punishmentId = await createPunishment(db, {
      dueDate,
      sourceDate: date,
      level: punishmentLevel.level,
      label: punishmentLevel.label,
      exercises: punishmentLevel.exercises,
      shameMessage: punishmentLevel.shameMessage,
    });
  }

  return {
    level: punishmentLevel.level,
    label: punishmentLevel.label,
    shameMessage: punishmentLevel.shameMessage,
    exercises: punishmentLevel.exercises,
    created: punishmentLevel.level > 0,
    punishmentId,
    dueDate,
    sourceDate: date,
  };
}
