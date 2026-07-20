import { z } from 'zod';
import type { AppSelectOption } from '@/components/common/AppSelect';

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Clinic locations a slot can be booked at. */
export const LOCATION_OPTIONS: AppSelectOption[] = [
  { label: 'La Crescenta', value: 'la-crescenta' },
  { label: 'Pasadena', value: 'pasadena' },
  { label: 'Glendale', value: 'glendale' },
  { label: 'Telehealth', value: 'telehealth' },
];

const slotSchema = z.object({
  /** `HH:mm` from an `<input type="time">`; `''` when unset. */
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
});

const daySchema = z.object({
  day: z.string(),
  enabled: z.boolean(),
  slots: z.array(slotSchema).min(1, 'A day needs at least one slot'),
});

/**
 * Single source of truth for the Availability Preferences form.
 *
 * Times are only required on days the provider has ticked — an unchecked day
 * may keep its blank (or stale) slots without blocking a save. That's why the
 * requirement lives in `superRefine` rather than on the field itself.
 *
 * `HH:mm` strings compare correctly with `<`, so the ordering check needs no
 * date parsing.
 */
export const availabilityPreferencesSchema = z
  .object({ days: z.array(daySchema) })
  .superRefine((values, ctx) => {
    values.days.forEach((day, dayIndex) => {
      if (!day.enabled) return;

      day.slots.forEach((slot, slotIndex) => {
        const at = (field: string) => [
          'days',
          dayIndex,
          'slots',
          slotIndex,
          field,
        ];

        if (!slot.startTime) {
          ctx.addIssue({
            code: 'custom',
            path: at('startTime'),
            message: 'Start time is required',
          });
        }
        if (!slot.endTime) {
          ctx.addIssue({
            code: 'custom',
            path: at('endTime'),
            message: 'End time is required',
          });
        }
        if (slot.startTime && slot.endTime && slot.endTime <= slot.startTime) {
          ctx.addIssue({
            code: 'custom',
            path: at('endTime'),
            message: 'End time must be after start time',
          });
        }
      });
    });
  });

export type AvailabilityPreferencesValues = z.infer<
  typeof availabilityPreferencesSchema
>;

export type DaySlot =
  AvailabilityPreferencesValues['days'][number]['slots'][number];

/** An empty slot row, used for the initial state and for "add slot". */
export const emptySlot = (location = LOCATION_OPTIONS[0].value): DaySlot => ({
  startTime: '',
  endTime: '',
  location,
});
