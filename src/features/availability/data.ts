import { DAYS, LOCATION_OPTIONS, emptySlot } from './schema';
import type { AvailabilityPreferencesValues } from './schema';
import type { AvailabilityRow } from './types';

/** Static sample rows; real data drops into the same columns as props. */
export const AVAILABILITY_ROWS: AvailabilityRow[] = [
  {
    id: 'david-kim',
    name: 'David Kim',
    availableDays: 5,
    blockDays: 0,
    lastUpdatedOn: '2026-06-20',
    updatedBy: 'Front Desk',
  },
  {
    id: 'diego-santos',
    name: 'Diego Santos',
    availableDays: 5,
    blockDays: 2,
    lastUpdatedOn: '2026-06-09',
    updatedBy: 'Front Desk',
  },
  {
    id: 'hannah-cole',
    name: 'Hannah Cole',
    availableDays: 5,
    blockDays: 1,
    lastUpdatedOn: '2026-06-05',
    updatedBy: 'Ricardo Hurtado',
  },
  {
    id: 'marcus-bell',
    name: 'Marcus Bell',
    availableDays: 4,
    blockDays: 1,
    lastUpdatedOn: '2026-06-15',
    updatedBy: 'Front Desk',
  },
  {
    id: 'nicole-adams',
    name: 'Nicole Adams',
    availableDays: 6,
    blockDays: 2,
    lastUpdatedOn: '2026-06-24',
    updatedBy: 'Ricardo Hurtado',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    availableDays: 6,
    blockDays: 0,
    lastUpdatedOn: '2026-06-12',
    updatedBy: 'Ricardo Hurtado',
  },
  {
    id: 'ricardo-hurtado',
    name: 'Ricardo Hurtado',
    availableDays: 5,
    blockDays: 1,
    lastUpdatedOn: '2026-06-28',
    updatedBy: 'Ricardo Hurtado',
  },
  {
    id: 'sofia-lopez',
    name: 'Sofia Lopez',
    availableDays: 5,
    blockDays: 1,
    lastUpdatedOn: '2026-06-18',
    updatedBy: 'Ricardo Hurtado',
  },
];

/** Options for the provider filter; "all" is the default. */
export const PROVIDER_OPTIONS = [
  { label: 'All Providers', value: 'all' },
  ...AVAILABILITY_ROWS.map((row) => ({ label: row.name, value: row.id })),
];

const DEFAULT_LOCATION = LOCATION_OPTIONS[0].value;

/**
 * Blank working hours: no day ticked, one empty slot each. The provider opts
 * into the days they work, which is when start/end time become required.
 * Replace with the provider's saved preferences once the API lands.
 */
export function defaultPreferences(): AvailabilityPreferencesValues {
  return {
    days: DAYS.map((day) => ({
      day,
      enabled: false,
      slots: [emptySlot(DEFAULT_LOCATION)],
    })),
  };
}
