import { describe, it, expect } from 'vitest';
import { emptyHoliday, holidaySchema } from '@/features/holidays/schema';
import type { HolidayFormValues } from '@/features/holidays/schema';

const valid: HolidayFormValues = {
  title: 'Christmas',
  date: '2026-12-25',
  description: '',
};

/** Every issue as `field: message`. */
function issues(values: HolidayFormValues): string[] {
  const result = holidaySchema.safeParse(values);
  return result.success
    ? []
    : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
}

describe('holidaySchema', () => {
  it('accepts a title and a valid ISO date', () => {
    expect(issues(valid)).toEqual([]);
  });

  it('accepts an optional description', () => {
    expect(issues({ ...valid, description: 'Clinic closed' })).toEqual([]);
  });

  it('requires a title', () => {
    expect(issues({ ...valid, title: '' })).toEqual([
      'title: Holiday title is required',
    ]);
  });

  it('rejects a whitespace-only title', () => {
    expect(issues({ ...valid, title: '   ' })).toEqual([
      'title: Holiday title is required',
    ]);
  });

  it('requires a date', () => {
    expect(issues({ ...valid, date: '' })).toEqual(['date: Date is required']);
  });

  it('reports "required" once for a blank date, not also "invalid"', () => {
    // One mistake must not produce two messages.
    expect(issues({ ...valid, date: '' })).toHaveLength(1);
  });

  it('rejects a display-formatted date', () => {
    // MM/DD/YYYY is what the user sees; ISO is what we store.
    expect(issues({ ...valid, date: '12/25/2026' })).toEqual([
      'date: Enter a valid date',
    ]);
  });

  it('rejects a calendar-impossible date', () => {
    expect(issues({ ...valid, date: '2026-02-31' })).toEqual([
      'date: Enter a valid date',
    ]);
  });

  it('rejects a well-shaped but nonsense month', () => {
    expect(issues({ ...valid, date: '2026-13-01' })).toEqual([
      'date: Enter a valid date',
    ]);
  });

  it('reports both fields when the form is entirely blank', () => {
    const result = issues(emptyHoliday);
    expect(result).toContain('title: Holiday title is required');
    expect(result).toContain('date: Date is required');
  });
});
