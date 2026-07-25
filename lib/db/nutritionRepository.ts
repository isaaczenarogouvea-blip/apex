import * as SQLite from 'expo-sqlite';

import { DAILY_CALORIE_GOAL, DAILY_PROTEIN_GOAL, PRESET_MEALS } from '../../constants/meals';

/** Public shape of a single meal's log status for a given date. */
export interface MealLogEntry {
  date: string;
  mealId: string;
  name: string;
  time: string;
  kcal: number;
  protein: number;
  items: string[];
  eaten: boolean;
  eatenAt: string | null;
}

/** Raw shape of a row in the `meal_logs` table. */
interface MealLogRow {
  id: number;
  date: string;
  meal_id: string;
  eaten: number;
  eaten_at: string | null;
}

/**
 * Ensures every preset meal (breakfast, lunch, pre/post-workout, dinner,
 * supper) has a meal_logs row for `date` — inserting missing ones as
 * not-eaten — then returns all of them merged with their log status, in
 * PRESET_MEALS order.
 */
export async function getMealLogsForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<MealLogEntry[]> {
  for (const meal of PRESET_MEALS) {
    await db.runAsync(
      `INSERT OR IGNORE INTO meal_logs (date, meal_id, eaten, eaten_at) VALUES (?, ?, 0, NULL);`,
      [date, meal.id]
    );
  }

  const rows = await db.getAllAsync<MealLogRow>(`SELECT * FROM meal_logs WHERE date = ?;`, [
    date,
  ]);
  const rowsByMealId = new Map(rows.map((row) => [row.meal_id, row]));

  return PRESET_MEALS.map((meal) => {
    const row = rowsByMealId.get(meal.id);
    return {
      date,
      mealId: meal.id,
      name: meal.name,
      time: meal.time,
      kcal: meal.kcal,
      protein: meal.protein,
      items: meal.items,
      eaten: row?.eaten === 1,
      eatenAt: row?.eaten_at ?? null,
    };
  });
}

/**
 * Marks a preset meal as eaten (or not) for a given date.
 * Uses INSERT OR REPLACE keyed on the (date, meal_id) UNIQUE constraint.
 */
export async function toggleMealEaten(
  db: SQLite.SQLiteDatabase,
  date: string,
  mealId: string,
  eaten: boolean
): Promise<void> {
  const eatenAt = eaten ? new Date().toISOString() : null;
  await db.runAsync(
    `INSERT OR REPLACE INTO meal_logs (date, meal_id, eaten, eaten_at) VALUES (?, ?, ?, ?);`,
    [date, mealId, eaten ? 1 : 0, eatenAt]
  );
}

/** Public shape of a weight log entry. */
export interface WeightLogRecord {
  id: number;
  date: string;
  weightKg: number;
}

/** Raw shape of a row in the `weight_logs` table. */
interface WeightLogRow {
  id: number;
  date: string;
  weight_kg: number;
}

function weightRowToRecord(row: WeightLogRow): WeightLogRecord {
  return { id: row.id, date: row.date, weightKg: row.weight_kg };
}

/**
 * Records (or overwrites) the body weight logged for a given date.
 * Uses INSERT OR REPLACE keyed on the `date` UNIQUE constraint.
 */
export async function logWeight(
  db: SQLite.SQLiteDatabase,
  date: string,
  weightKg: number
): Promise<void> {
  await db.runAsync(`INSERT OR REPLACE INTO weight_logs (date, weight_kg) VALUES (?, ?);`, [
    date,
    weightKg,
  ]);
}

/**
 * Returns the most recent `limit` weight entries, newest first.
 */
export async function getWeightHistory(
  db: SQLite.SQLiteDatabase,
  limit: number
): Promise<WeightLogRecord[]> {
  const rows = await db.getAllAsync<WeightLogRow>(
    `SELECT * FROM weight_logs ORDER BY date DESC LIMIT ?;`,
    [limit]
  );
  return rows.map(weightRowToRecord);
}

/** Aggregated calorie/protein intake for a single date. */
export interface DailyNutritionSummary {
  date: string;
  kcalConsumed: number;
  proteinConsumed: number;
  kcalGoal: number;
  proteinGoal: number;
  mealsEaten: number;
  mealsTotal: number;
}

/**
 * Sums the kcal (and protein) of every meal marked eaten on `date`.
 * Meal macros are looked up from the PRESET_MEALS constants, since the
 * meal_logs table only tracks whether a meal was eaten, not its macros.
 */
export async function getCaloriesForDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<DailyNutritionSummary> {
  const rows = await db.getAllAsync<MealLogRow>(
    `SELECT * FROM meal_logs WHERE date = ? AND eaten = 1;`,
    [date]
  );
  const mealsById = new Map(PRESET_MEALS.map((meal) => [meal.id, meal]));

  let kcalConsumed = 0;
  let proteinConsumed = 0;
  for (const row of rows) {
    const meal = mealsById.get(row.meal_id);
    if (meal) {
      kcalConsumed += meal.kcal;
      proteinConsumed += meal.protein;
    }
  }

  return {
    date,
    kcalConsumed,
    proteinConsumed,
    kcalGoal: DAILY_CALORIE_GOAL,
    proteinGoal: DAILY_PROTEIN_GOAL,
    mealsEaten: rows.length,
    mealsTotal: PRESET_MEALS.length,
  };
}
