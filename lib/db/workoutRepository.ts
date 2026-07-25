import * as SQLite from 'expo-sqlite';

/** Public shape of a workout session. */
export interface WorkoutSessionRecord {
  id: number;
  date: string;
  workoutDay: string;
  startedAt: string;
  finishedAt: string | null;
  completed: boolean;
}

/** Raw shape of a row in the `workout_sessions` table. */
interface WorkoutSessionRow {
  id: number;
  date: string;
  workout_day: string;
  started_at: string;
  finished_at: string | null;
  completed: number;
}

function sessionRowToRecord(row: WorkoutSessionRow): WorkoutSessionRecord {
  return {
    id: row.id,
    date: row.date,
    workoutDay: row.workout_day,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    completed: row.completed === 1,
  };
}

/** Public shape of a logged set. */
export interface WorkoutSetRecord {
  id: number;
  sessionId: number;
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

/** Raw shape of a row in the `workout_sets` table. */
interface WorkoutSetRow {
  id: number;
  session_id: number;
  exercise_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  completed: number;
}

function setRowToRecord(row: WorkoutSetRow): WorkoutSetRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    weightKg: row.weight_kg,
    reps: row.reps,
    completed: row.completed === 1,
  };
}

/**
 * Starts a new workout session for `date`/`workoutDay` and returns its id.
 */
export async function createWorkoutSession(
  db: SQLite.SQLiteDatabase,
  date: string,
  workoutDay: string
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO workout_sessions (date, workout_day, started_at, finished_at, completed)
     VALUES (?, ?, ?, NULL, 0);`,
    [date, workoutDay, new Date().toISOString()]
  );
  return result.lastInsertRowId;
}

/**
 * Returns the most recent workout session recorded for `date`, if any.
 */
export async function getSessionForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<WorkoutSessionRecord | null> {
  const row = await db.getFirstAsync<WorkoutSessionRow>(
    `SELECT * FROM workout_sessions WHERE date = ? ORDER BY id DESC LIMIT 1;`,
    [date]
  );
  return row ? sessionRowToRecord(row) : null;
}

/**
 * Marks a workout session as finished, stamping the finish time.
 */
export async function completeSession(
  db: SQLite.SQLiteDatabase,
  sessionId: number
): Promise<void> {
  await db.runAsync(
    `UPDATE workout_sessions SET completed = 1, finished_at = ? WHERE id = ?;`,
    [new Date().toISOString(), sessionId]
  );
}

/**
 * Records (or updates) a single set within a session. Relies on the
 * UNIQUE(session_id, exercise_id, set_number) index so INSERT OR REPLACE
 * behaves as a true upsert — logging the same set twice just overwrites it.
 */
export async function upsertWorkoutSet(
  db: SQLite.SQLiteDatabase,
  sessionId: number,
  exerciseId: string,
  setNumber: number,
  weightKg: number,
  reps: number
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO workout_sets (session_id, exercise_id, set_number, weight_kg, reps, completed)
     VALUES (?, ?, ?, ?, ?, 1);`,
    [sessionId, exerciseId, setNumber, weightKg, reps]
  );
}

/**
 * Returns every set logged for a session, ordered by exercise then set number.
 */
export async function getSetsForSession(
  db: SQLite.SQLiteDatabase,
  sessionId: number
): Promise<WorkoutSetRecord[]> {
  const rows = await db.getAllAsync<WorkoutSetRow>(
    `SELECT * FROM workout_sets WHERE session_id = ? ORDER BY exercise_id ASC, set_number ASC;`,
    [sessionId]
  );
  return rows.map(setRowToRecord);
}
