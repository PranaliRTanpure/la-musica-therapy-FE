import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export const APP_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

/** Format an ISO string in a given timezone. */
export function formatInTz(
  iso: string,
  tz: string = APP_TZ,
  pattern = 'dd MMM yyyy, HH:mm'
): string {
  return formatInTimeZone(parseISO(iso), tz, pattern);
}

/** Convert a UTC ISO string to a Date in the local/zoned time. */
export function toLocal(iso: string, tz: string = APP_TZ): Date {
  return toZonedTime(parseISO(iso), tz);
}

/** Simple local format helper. */
export function fmt(date: Date | number, pattern = 'dd MMM yyyy'): string {
  return format(date, pattern);
}

/** Format an ISO date string for display. Safari rejects non-ISO input, so
 * always parse via `parseISO` rather than `new Date(string)`. */
export function formatShortDate(iso: string, pattern = 'MM/dd/yyyy'): string {
  return format(parseISO(iso), pattern);
}
