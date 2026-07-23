import { isValid, parseISO } from 'date-fns';
import { z } from 'zod';

/**
 * Single source of truth for the Schedule Trial form. `date` is the ISO
 * `yyyy-MM-dd` picked from `MonthCalendar`; `time` is the slot value picked
 * from `TimeSlotList` (e.g. `'09:00'`). Parsing goes through `parseISO`,
 * never `new Date(string)`, which Safari rejects for non-ISO input.
 */
export const scheduleTrialSchema = z.object({
  therapist: z.string().min(1, 'Therapist is required'),
  facility: z.string().min(1, 'Facility is required'),
  duration: z.string().min(1, 'Duration is required'),

  date: z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: 'custom', message: 'Date is required' });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !isValid(parseISO(value))) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid date' });
    }
  }),

  time: z.string().min(1, 'Time slot is required'),

  /** Optional free-text note; an empty string means "no notes". */
  notes: z.string(),
});

export type ScheduleTrialFormValues = z.infer<typeof scheduleTrialSchema>;

export const emptyScheduleTrial: ScheduleTrialFormValues = {
  therapist: '',
  facility: '',
  duration: '30 min',
  date: '',
  time: '',
  notes: '',
};
