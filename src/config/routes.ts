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
  SCHEDULING: '/scheduling',
  COMMUNICATION: '/communication',
  SETTINGS: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Build the concrete path to a lead's form for `LEADS_DETAIL`. */
export const leadDetailPath = (id: string) => `/clients/leads/${id}`;
