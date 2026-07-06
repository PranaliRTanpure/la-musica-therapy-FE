import type { SvgIconComponent } from '@mui/icons-material';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import ChatRounded from '@mui/icons-material/ChatRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import { ROUTES } from '@/config/routes';

export interface NavItem {
  label: string;
  /** Route path the item links to. */
  to: string;
  /** MUI icon component rendered in the rail. */
  icon: SvgIconComponent;
}

/**
 * Primary side-nav items (Figma "Side Nav Admin Provider"). Icons are the
 * closest MUI equivalents of the design's Phosphor glyphs, since this project
 * ships `@mui/icons-material` rather than `@phosphor-icons/react`.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: GridViewRounded },
  { label: 'Clients', to: ROUTES.CLIENTS, icon: PeopleAltRounded },
  { label: 'Scheduling', to: ROUTES.SCHEDULING, icon: CalendarMonthRounded },
  { label: 'Communication', to: ROUTES.COMMUNICATION, icon: ChatRounded },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: SettingsRounded },
];
