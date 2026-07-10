import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ViewerPanelProps {
  title: string;
  /** Footer buttons, right-aligned; the footer is omitted when absent. */
  actions?: ReactNode;
  /** Panel body, rendered on the scrollable canvas. */
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Detail panel shown beside a selection list: a fixed title bar, a scrollable
 * canvas, and a footer pinned to the panel. Only the canvas scrolls, so the
 * footer actions stay reachable at any viewport height.
 */
export function ViewerPanel({
  title,
  actions,
  children,
  sx,
}: ViewerPanelProps) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="subtitle1"
        component="h2"
        sx={(theme) => ({
          flexShrink: 0,
          p: 2,
          fontWeight: theme.typography.fontWeightSemiBold,
        })}
      >
        {title}
      </Typography>
      <Divider />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          bgcolor: 'background.default',
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>

      {actions ? (
        <>
          <Divider />
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1.5}
            flexWrap="wrap"
            useFlexGap
            sx={{ flexShrink: 0, p: 2 }}
          >
            {actions}
          </Stack>
        </>
      ) : null}
    </Box>
  );
}
