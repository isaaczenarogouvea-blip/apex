import * as SQLite from 'expo-sqlite';

import { runMigrations } from './migrations';

const DATABASE_NAME = 'apex.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Lazily opens (and caches) the singleton SQLite database connection,
 * running migrations exactly once on first access.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
}

async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await runMigrations(db);
  return db;
}

/**
 * Closes the cached database connection, if any, and clears the cache.
 * Primarily useful for tests or when the app needs to reset local state.
 */
export async function closeDatabase(): Promise<void> {
  if (!dbPromise) {
    return;
  }
  const db = await dbPromise;
  await db.closeAsync();
  dbPromise = null;
}
