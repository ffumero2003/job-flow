/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Jan 28, 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Calculate days until a target date
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {number|null} Number of days (negative if past), or null if no date
 */
export function getDaysUntil(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

/**
 * Get a human-readable label for days until a date
 * @param {number|null} days - Number of days
 * @returns {string} Human-readable label
 */
export function getDaysUntilLabel(days) {
  if (days === null) return "";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/**
 * Get today's date in ISO format
 * @returns {string} Today's date (YYYY-MM-DD)
 */
export function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}
