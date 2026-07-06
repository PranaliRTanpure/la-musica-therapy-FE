/**
 * Central route path constants. Import these instead of hardcoding path
 * strings so nav config, the router, and links stay in sync.
 */
export const ROUTES = {
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  SCHEDULING: '/scheduling',
  COMMUNICATION: '/communication',
  SETTINGS: '/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
