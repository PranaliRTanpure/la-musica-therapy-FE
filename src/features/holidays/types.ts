/** One clinic holiday. */
export interface HolidayRow {
  id: string;
  title: string;
  /** ISO date; display goes through `formatShortDate` in `src/utils/date.ts`. */
  date: string;
  /** Free-text note; empty renders as an em dash. */
  description: string;
  /** ISO date the record was created. */
  createdDate: string;
}
