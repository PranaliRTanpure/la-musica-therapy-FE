import type { SvgIconComponent } from '@mui/icons-material';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
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
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: GridViewOutlined },
  { label: 'Clients', to: ROUTES.CLIENTS, icon: PeopleAltOutlined },
  { label: 'Scheduling', to: ROUTES.SCHEDULING, icon: CalendarMonthOutlined },
  { label: 'Communication', to: ROUTES.COMMUNICATION, icon: ChatOutlined },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: SettingsOutlined },
];
