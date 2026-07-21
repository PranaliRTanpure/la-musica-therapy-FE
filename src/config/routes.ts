/**
 * Central route path constants. Import these instead of hardcoding path
 * strings so nav config, the router, and links stay in sync.
 */
export const ROUTES = {
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  LEADS_NEW: '/clients/leads/new',
  /** Existing lead's form (opened from the leads list); `:id` = lead id. */
  LEADS_DETAIL: '/clients/leads/:id',
  /** Patient charting (opened from prospect/waiting-list/client name); `:id`. */
  PATIENT_CHART: '/clients/patients/:id',
  SCHEDULING: '/scheduling',
  COMMUNICATION: '/communication',
  SETTINGS: '/settings',
  SETTINGS_AVAILABILITY: '/settings/availability',
  /** A single provider's availability; `:id` = provider id. */
  SETTINGS_AVAILABILITY_DETAIL: '/settings/availability/:id',
  SETTINGS_HOLIDAYS: '/settings/holidays',
  SETTINGS_ROLES: '/settings/roles-and-permissions',
  SETTINGS_INSURERS: '/settings/insurers',
  SETTINGS_PROCEDURAL_CODES: '/settings/procedural-codes',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Build the concrete path to a lead's form for `LEADS_DETAIL`. */
export const leadDetailPath = (id: string) => `/clients/leads/${id}`;

/** Build the concrete path to a patient's chart for `PATIENT_CHART`. */
export const patientChartPath = (id: string) => `/clients/patients/${id}`;

/** Build the concrete path for `SETTINGS_AVAILABILITY_DETAIL`. */
export const availabilityDetailPath = (id: string) =>
  `/settings/availability/${id}`;
