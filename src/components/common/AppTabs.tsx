import type { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AppTabItem {
  label: string;
}

export interface AppTabsProps {
  items: AppTabItem[];
  /** Active tab index. */
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  /** Forwarded to the root container so callers can adjust spacing in context. */
  sx?: SxProps<Theme>;
}

/**
 * Shared segmented-control tab bar used across the app. Renders as a rounded,
 * bordered container (the pill "group") with the active tab filled by a tinted
 * primary pill and inactive tabs muted — matching the designers' Clients tabs.
 * Wraps MUI `Tabs` so keyboard navigation / a11y come for free; the moving
 * underline indicator is hidden in favor of the pill highlight.
 */
export function AppTabs({
  items,
  value,
  onChange,
  ariaLabel,
  sx,
}: AppTabsProps) {
  const handleChange = (_e: SyntheticEvent, next: number) => onChange(next);

  return (
    <Box
      sx={[
        {
          display: 'inline-flex',
          maxWidth: '100%',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label={ariaLabel}
        sx={{
          minHeight: 0,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTabs-flexContainer': { gap: 0.5 },
        }}
      >
        {items.map((item) => (
          <Tab
            key={item.label}
            label={item.label}
            disableRipple
            sx={(theme) => ({
              minHeight: 0,
              minWidth: 0,
              px: 1.5,
              py: 1,

              borderRadius: 0.75,
              fontSize: theme.typography.actionSmall.fontSize,
              fontWeight: theme.typography.actionSmall.fontWeight,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                // fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.light, 0.16),
              },
            })}
          />
        ))}
      </Tabs>
    </Box>
  );
}
