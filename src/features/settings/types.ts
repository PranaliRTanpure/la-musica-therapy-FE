import type { SvgIconComponent } from '@mui/icons-material';

/** One navigable row inside a settings card. */
export interface SettingsLink {
  label: string;
  /** Route path the row navigates to. */
  to: string;
}

/** One titled card on the Settings screen. */
export interface SettingsGroup {
  id: string;
  title: string;
  /** MUI icon component rendered beside the title. */
  icon: SvgIconComponent;
  links: SettingsLink[];
}
