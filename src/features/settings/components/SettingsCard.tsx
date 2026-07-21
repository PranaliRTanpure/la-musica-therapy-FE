import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SettingsGroup } from '../types';

export interface SettingsCardProps {
  group: SettingsGroup;
  sx?: SxProps<Theme>;
}

/**
 * One Settings group: an icon + title header over a divided list of links.
 * Rows are real anchors (`RouterLink`), so middle-click, open-in-new-tab and
 * keyboard activation work without extra handling.
 */
export function SettingsCard({ group, sx }: SettingsCardProps) {
  const { title, icon: Icon, links } = group;

  return (
    <Paper
      sx={[
        { borderRadius: 2, overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2 }}>
        <Icon fontSize="small" color="primary" aria-hidden />
        <Typography
          variant="subtitle1"
          component="h2"
          sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
        >
          {title}
        </Typography>
      </Stack>
      <Divider />

      <List disablePadding aria-label={title}>
        {links.map((link, index) => (
          <Fragment key={link.to}>
            {index > 0 ? <Divider component="li" /> : null}
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.to}
                // >= 44px tap target (Apple HIG).
                sx={{ px: 2, py: 1.5, gap: 1 }}
              >
                <ListItemText
                  primary={link.label}
                  slotProps={{ primary: { variant: 'body2' } }}
                />
                <ChevronRightIcon
                  fontSize="small"
                  aria-hidden
                  sx={{ color: 'text.secondary', flexShrink: 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </Paper>
  );
}
