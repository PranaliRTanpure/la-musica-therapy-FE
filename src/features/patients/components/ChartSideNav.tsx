import type { ReactNode } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ChartNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface ChartSideNavProps {
  items: ChartNavItem[];
  active: string;
  onChange: (id: string) => void;
  sx?: SxProps<Theme>;
}

/** Vertical section nav for the chart (Documents / Notes / Profile). Controlled
 * by props; the active item is tinted with the primary color. */
export function ChartSideNav({
  items,
  active,
  onChange,
  sx,
}: ChartSideNavProps) {
  return (
    <List component="nav" sx={sx}>
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          selected={active === item.id}
          onClick={() => onChange(item.id)}
          sx={(theme) => ({
            borderRadius: 1,
            mb: 0.5,
            '&.Mui-selected': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              '& .MuiListItemIcon-root': { color: 'primary.main' },
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
            },
          })}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                variant: 'body2',
                sx: (theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                }),
              },
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
