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

/**
 * Section nav for the chart (Documents / Notes / Profile). A vertical rail on
 * desktop; below `md` it becomes a horizontal, scrollable strip so it costs one
 * row of height instead of one row per item. Controlled by props; the active
 * item is tinted with the primary color.
 */
export function ChartSideNav({
  items,
  active,
  onChange,
  sx,
}: ChartSideNavProps) {
  return (
    <List
      component="nav"
      sx={[
        {
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: 0.5,
          overflowX: { xs: 'auto', md: 'visible' },
          WebkitOverflowScrolling: 'touch',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          selected={active === item.id}
          onClick={() => onChange(item.id)}
          sx={(theme) => ({
            borderRadius: 1,
            // MUI's ListItemButton ships `flexGrow: 1`, inert in the List's
            // default block layout but active now that the List is a flex
            // container — it would stretch items down the rail (and across the
            // mobile strip). Size to content instead.
            flexGrow: 0,
            // Don't let items squash below their label on a narrow strip.
            flexShrink: 0,
            '&.Mui-selected': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              '& .MuiListItemIcon-root': { color: 'primary.main' },
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
            },
          })}
        >
          <ListItemIcon
            sx={{ minWidth: { xs: 32, md: 36 }, color: 'text.secondary' }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                variant: 'body2',
                noWrap: true,
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
