import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ApartmentOutlined from '@mui/icons-material/ApartmentOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import { ROUTES } from '@/config/routes';
import type { SettingsGroup } from './types';

/**
 * The Settings landing cards. Static: the groups a provider can configure.
 * Adding a row here is enough — the screen renders whatever it's given.
 */
export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'appointment',
    title: 'Appointment',
    icon: CalendarMonthOutlined,
    links: [
      { label: 'Availability', to: ROUTES.SETTINGS_AVAILABILITY },
      { label: 'Holidays', to: ROUTES.SETTINGS_HOLIDAYS },
    ],
  },
  {
    id: 'facility',
    title: 'Facility',
    icon: ApartmentOutlined,
    links: [{ label: 'Roles and Permission', to: ROUTES.SETTINGS_ROLES }],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: ReceiptLongOutlined,
    links: [
      { label: 'Insurers', to: ROUTES.SETTINGS_INSURERS },
      { label: 'Procedural Codes', to: ROUTES.SETTINGS_PROCEDURAL_CODES },
    ],
  },
];
