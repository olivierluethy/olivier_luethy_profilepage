/** Date helpers shared by the project and blog loaders. */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** `YYYY-MM` or `YYYY-MM-DD` to a UTC timestamp. */
export function toTimestamp(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day ?? 1);
}

/** `2026-04` to `Apr 2026`. */
export function formatMonth(date: string): string {
  const [year, month] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** `2026-06-12` to `12 June 2026`. */
export function formatLongDate(date: string): string {
  return new Date(toTimestamp(date)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** `Apr 2026 — Present` while ongoing, otherwise `Apr 2026 — Nov 2026`. */
export function formatRange(startDate: string, endDate: string): string {
  const start = formatMonth(startDate);
  if (!endDate) return `${start} — Present`;
  const end = formatMonth(endDate);
  return start === end ? start : `${start} — ${end}`;
}

/** Average adult reading speed, rounded up, never zero. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
