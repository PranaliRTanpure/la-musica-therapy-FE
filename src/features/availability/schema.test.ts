import { describe, it, expect } from 'vitest';
import {
  availabilityPreferencesSchema,
  emptySlot,
} from '@/features/availability/schema';
import type { AvailabilityPreferencesValues } from '@/features/availability/schema';

/** A one-day form value, so each test states only what it cares about. */
function form(
  enabled: boolean,
  slots: AvailabilityPreferencesValues['days'][number]['slots']
): AvailabilityPreferencesValues {
  return { days: [{ day: 'Monday', enabled, slots }] };
}

const validSlot = {
  startTime: '11:30',
  endTime: '20:00',
  location: 'la-crescenta',
};

/** Every issue's dotted path, e.g. `days.0.slots.0.startTime`. */
function issuePaths(values: AvailabilityPreferencesValues): string[] {
  const result = availabilityPreferencesSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
}

describe('availabilityPreferencesSchema', () => {
  it('accepts an enabled day with a complete slot', () => {
    expect(issuePaths(form(true, [validSlot]))).toEqual([]);
  });

  it('requires a start time once the day is ticked', () => {
    const values = form(true, [{ ...validSlot, startTime: '' }]);
    expect(issuePaths(values)).toContain('days.0.slots.0.startTime');
  });

  it('requires an end time once the day is ticked', () => {
    const values = form(true, [{ ...validSlot, endTime: '' }]);
    expect(issuePaths(values)).toContain('days.0.slots.0.endTime');
  });

  it('reports both times when the ticked day is entirely blank', () => {
    const paths = issuePaths(form(true, [emptySlot()]));
    expect(paths).toContain('days.0.slots.0.startTime');
    expect(paths).toContain('days.0.slots.0.endTime');
  });

  it('does NOT require times while the day is unticked', () => {
    // The core rule: an unchecked day may keep blank slots and still save.
    expect(issuePaths(form(false, [emptySlot()]))).toEqual([]);
  });

  it('rejects an end time that is not after the start time', () => {
    const values = form(true, [
      { ...validSlot, startTime: '20:00', endTime: '11:30' },
    ]);
    expect(issuePaths(values)).toContain('days.0.slots.0.endTime');
  });

  it('rejects an end time equal to the start time', () => {
    const values = form(true, [
      { ...validSlot, startTime: '11:30', endTime: '11:30' },
    ]);
    expect(issuePaths(values)).toContain('days.0.slots.0.endTime');
  });

  it('does not run the ordering check when a time is missing', () => {
    // Only the "required" issue should fire — not a spurious ordering error.
    const values = form(true, [{ ...validSlot, endTime: '' }]);
    expect(issuePaths(values)).toEqual(['days.0.slots.0.endTime']);
  });

  it('validates every slot of a ticked day independently', () => {
    const values = form(true, [validSlot, { ...validSlot, startTime: '' }]);
    expect(issuePaths(values)).toEqual(['days.0.slots.1.startTime']);
  });

  it('validates each day independently', () => {
    const values: AvailabilityPreferencesValues = {
      days: [
        { day: 'Monday', enabled: false, slots: [emptySlot()] },
        { day: 'Tuesday', enabled: true, slots: [emptySlot()] },
      ],
    };
    const paths = issuePaths(values);
    expect(paths).toContain('days.1.slots.0.startTime');
    expect(paths.some((p) => p.startsWith('days.0'))).toBe(false);
  });

  it('requires at least one slot per day', () => {
    expect(issuePaths(form(true, []))).toContain('days.0.slots');
  });
});
