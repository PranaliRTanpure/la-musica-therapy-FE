import { isValid, parseISO } from 'date-fns';
import { z } from 'zod';

/**
 * Single source of truth for the Add/Edit Holiday form. The TS type is inferred
 * from the schema, so the form and its data never drift.
 *
 * `date` is the ISO `yyyy-MM-dd` an `<input type="date">` produces — never a
 * display string. Parsing goes through `parseISO`, never `new Date(string)`,
 * which Safari rejects for non-ISO input.
 */
export const holidaySchema = z.object({
  title: z.string().trim().min(1, 'Holiday title is required'),

  date: z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: 'custom', message: 'Date is required' });
      return;
    }
    // Guard the shape before parsing so a malformed value can't report both
    // "required" and "invalid" for the same mistake.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !isValid(parseISO(value))) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid date' });
    }
  }),

  /** Optional free-text note; an empty string means "no description". */
  description: z.string(),
});

export type HolidayFormValues = z.infer<typeof holidaySchema>;

export const emptyHoliday: HolidayFormValues = {
  title: '',
  date: '',
  description: '',
};
