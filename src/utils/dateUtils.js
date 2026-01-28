/**
 * FORMAT DATE
 *
 * Converts ISO date string to human-readable format.
 *
 * @param {string} dateString - ISO date like "2026-01-28"
 * @returns {string} Formatted date like "Jan 28, 2026" or "—" if null
 *
 * Why this format?
 * - "Jan 28, 2026" is more readable than "2026-01-28"
 * - US locale is most common for this app
 * - "—" (em dash) is cleaner than "N/A" or empty string
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short", // "Jan" instead of "January" or "1"
    day: "numeric", // "28" instead of "028"
    year: "numeric", // "2026"
  });
}

/**
 * GET DAYS UNTIL
 *
 * Calculates number of days from today to target date.
 *
 * @param {string} dateString - ISO date like "2026-01-28"
 * @returns {number|null} Days until date (negative if past), null if no date
 *
 * Why normalize to midnight?
 * Without setHours(0,0,0,0), comparing "today 11pm" to "tomorrow 1am"
 * would show 0 days (only 2 hours difference). Normalizing ensures
 * we're comparing calendar days, not exact times.
 */
export function getDaysUntil(dateString) {
  if (!dateString) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0); // Normalize to start of day

  // Difference in milliseconds, converted to days
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

/**
 * GET DAYS UNTIL LABEL
 *
 * Converts numeric days to human-friendly label.
 *
 * @param {number|null} days - Number of days (can be negative)
 * @returns {string} Human label like "Today", "Tomorrow", "In 5 days", "3d overdue"
 *
 * Why these specific labels?
 * - "Today" and "Tomorrow" are more scannable than "In 0 days"
 * - "In X days" is clearer than just "X days"
 * - "Xd overdue" signals urgency with compact format
 */
export function getDaysUntilLabel(days) {
  if (days === null) return "";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/**
 * GET TODAY ISO
 *
 * Returns today's date in ISO format for form defaults.
 *
 * @returns {string} Today's date like "2026-01-28"
 *
 * Why ISO format?
 * - HTML date inputs require this format
 * - Consistent with how we store dates
 * - Easy to sort alphabetically
 */
export function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}
