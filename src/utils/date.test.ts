import { describe, it, expect } from 'vitest';
import { fmt, formatInTz } from '@/utils/date';

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
});
