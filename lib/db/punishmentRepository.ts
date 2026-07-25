import * as SQLite from 'expo-sqlite';

import { PunishmentExercise } from '../../constants/punishments';

/** Public shape of a punishment, as consumed by the rest of the app. */
export interface PunishmentRecord {
  id: number;
  createdAt: string;
  dueDate: string;
  sourceDate: string;
  level: number;
  label: string;
  exercises: PunishmentExercise[];
  shameMessage: string;
  completed: boolean;
  completedAt: string | null;
}

/** Input required to create a new punishment. */
export interface NewPunishment {
  dueDate: string;
  sourceDate: string;
  level: number;
  label: string;
  exercises: PunishmentExercise[];
  shameMessage: string;
}

/** Raw shape of a row in the `punishments` table. `exercises` is stored as a JSON string. */
interface PunishmentRow {
  id: number;
  created_at: string;
  due_date: string;
  source_date: string;
  level: number;
  label: string;
  exercises: string;
  shame_message: string;
  completed: number;
  completed_at: string | null;
}

function rowToRecord(row: PunishmentRow): PunishmentRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    dueDate: row.due_date,
    sourceDate: row.source_date,
    level: row.level,
    label: row.label,
    exercises: JSON.parse(row.exercises) as PunishmentExercise[],
    shameMessage: row.shame_message,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
}

/**
 * Inserts a new punishment record for a failed day and returns its id.
 */
export async function createPunishment(
  db: SQLite.SQLiteDatabase,
  punishment: NewPunishment
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO punishments
       (created_at, due_date, source_date, level, label, exercises, shame_message, completed, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL);`,
    [
      new Date().toISOString(),
      punishment.dueDate,
      punishment.sourceDate,
      punishment.level,
      punishment.label,
      JSON.stringify(punishment.exercises),
      punishment.shameMessage,
    ]
  );
  return result.lastInsertRowId;
}

/**
 * Returns every punishment that has not yet been completed, soonest due first.
 */
export async function getActivePunishments(
  db: SQLite.SQLiteDatabase
): Promise<PunishmentRecord[]> {
  const rows = await db.getAllAsync<PunishmentRow>(
    `SELECT * FROM punishments WHERE completed = 0 ORDER BY due_date ASC;`
  );
  return rows.map(rowToRecord);
}

/**
 * Marks a punishment as completed, stamping the completion time.
 */
export async function completePunishment(db: SQLite.SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`UPDATE punishments SET completed = 1, completed_at = ? WHERE id = ?;`, [
    new Date().toISOString(),
    id,
  ]);
}

/**
 * Finds the punishment (if any) generated from a given source date
 * (i.e. the day whose failures triggered the punishment).
 */
export async function getPunishmentForDate(
  db: SQLite.SQLiteDatabase,
  sourceDate: string
): Promise<PunishmentRecord | null> {
  const row = await db.getFirstAsync<PunishmentRow>(
    `SELECT * FROM punishments WHERE source_date = ? ORDER BY id DESC LIMIT 1;`,
    [sourceDate]
  );
  return row ? rowToRecord(row) : null;
}
