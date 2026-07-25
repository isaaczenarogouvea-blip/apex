/**
 * Date helpers shared across repositories, engines, and hooks.
 * All dates in the app are represented as 'YYYY-MM-DD' strings (local time,
 * not UTC) so they line up with how SQLite stores and compares them.
 */

/**
 * Formats a Date object as a local 'YYYY-MM-DD' string.
 * Defaults to "now" when no date is supplied.
 */
export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds (or subtracts, with a negative value) a number of days to a
 * 'YYYY-MM-DD' date string and returns the result in the same format.
 */
export function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getTodayDateString(date);
}
