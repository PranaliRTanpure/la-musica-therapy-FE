import { describe, it, expect } from 'vitest';
import { fmt, formatInTz, formatShortDate } from '@/utils/date';

describe('date utils', () => {
  it('fmt formats a date with the default pattern', () => {
    const date = new Date('2026-03-15T10:30:00Z');
    expect(fmt(date)).toBe('15 Mar 2026');
  });

  it('fmt respects a custom pattern', () => {
    const date = new Date('2026-03-15T10:30:00Z');
    expect(fmt(date, 'yyyy/MM/dd')).toBe('2026/03/15');
  });

  it('formatInTz formats an ISO string in a given timezone', () => {
    const result = formatInTz(
      '2026-03-15T10:30:00Z',
      'America/New_York',
      'HH:mm'
    );
    expect(result).toBe('06:30'); // UTC 10:30 → EDT 06:30
  });

  it('formatShortDate renders a date-only ISO string as MM/dd/yyyy', () => {
    expect(formatShortDate('2026-11-02')).toBe('11/02/2026');
  });

  it('formatShortDate respects a custom pattern', () => {
    expect(formatShortDate('2026-11-02', 'dd MMM yyyy')).toBe('02 Nov 2026');
  });

  it('formatShortDate does not shift a date-only ISO string across days', () => {
    // parseISO treats a date-only string as local midnight; a naive
    // `new Date('2026-11-02')` would parse as UTC and roll back a day in
    // negative-offset timezones.
    expect(formatShortDate('2026-11-02', 'dd')).toBe('02');
  });
});
