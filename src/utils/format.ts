/**
 * Formatting helpers shared across cards, listings, and article pages.
 */

/** Format a date as e.g. "30 Aug 2026". Locale fixed for deterministic builds. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a date as e.g. "Monday, August 31, 2026". */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Machine-readable date for <time datetime>, e.g. "2026-08-30". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Human label for reading time. */
export function readingTimeLabel(minutes: number): string {
  return `${Math.max(1, Math.round(minutes))} min read`;
}
