import * as SQLite from 'expo-sqlite';

/**
 * Creates all APEX tables if they do not already exist.
 * Safe to call on every app start — every statement is idempotent.
 */
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      UNIQUE(habit_id, date)
    );

    CREATE TABLE IF NOT EXISTS daily_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      points_earned INTEGER DEFAULT 0,
      points_possible INTEGER NOT NULL,
      score_percent REAL DEFAULT 0,
      failure_count INTEGER DEFAULT 0,
      weighted_failure_count REAL DEFAULT 0,
      day_status TEXT DEFAULT 'pending',
      finalized INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS punishments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      due_date TEXT NOT NULL,
      source_date TEXT NOT NULL,
      level INTEGER NOT NULL,
      label TEXT NOT NULL,
      exercises TEXT NOT NULL,
      shame_message TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      workout_day TEXT NOT NULL,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      completed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workout_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      weight_kg REAL DEFAULT 0,
      reps INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS meal_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      meal_id TEXT NOT NULL,
      eaten INTEGER DEFAULT 0,
      eaten_at TEXT,
      UNIQUE(date, meal_id)
    );

    CREATE TABLE IF NOT EXISTS weight_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      weight_kg REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      current_count INTEGER DEFAULT 0,
      best_count INTEGER DEFAULT 0,
      last_date TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
    CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
    CREATE INDEX IF NOT EXISTS idx_daily_scores_date ON daily_scores(date);
    CREATE INDEX IF NOT EXISTS idx_punishments_source_date ON punishments(source_date);
    CREATE INDEX IF NOT EXISTS idx_punishments_due_date ON punishments(due_date);
    CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(date);
    CREATE INDEX IF NOT EXISTS idx_workout_sets_session_id ON workout_sets(session_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_workout_sets_unique
      ON workout_sets(session_id, exercise_id, set_number);
    CREATE INDEX IF NOT EXISTS idx_meal_logs_date ON meal_logs(date);
    CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON weight_logs(date);
    CREATE INDEX IF NOT EXISTS idx_streaks_type ON streaks(type);
  `);
}
