/** One provider's availability summary row. */
export interface AvailabilityRow {
  id: string;
  name: string;
  /** Days per week the provider is bookable. */
  availableDays: number;
  /** Days per week the provider has blocked off. */
  blockDays: number;
  /** ISO date; display goes through `formatShortDate` in `src/utils/date.ts`. */
  lastUpdatedOn: string;
  updatedBy: string;
}
