import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

/**
 * Semantic tone for a status pill. Maps to a theme palette color; the pill uses
 * a tinted background (alpha of that color) with the solid color for text.
 */
export type StatusTone = 'success' | 'warning' | 'info' | 'neutral';

// Extends Box props (minus the ones we own) so callers keep `sx`, `className`,
// `onClick`, etc. `color` is omitted because the tone drives it internally.
export interface StatusChipProps extends Omit<BoxProps, 'children' | 'color'> {
  label: string;
  tone?: StatusTone;
  /** Show a trailing chevron (e.g. the "Trial Completed ⌄" editable statuses). */
  dropdown?: boolean;
}

function toneMain(theme: Theme, tone: StatusTone): string {
  switch (tone) {
    case 'success':
      return theme.palette.success.main;
    case 'warning':
      return theme.palette.warning.main;
    case 'info':
      return theme.palette.info.main;
    default:
      return theme.palette.text.secondary;
  }
}

/**
 * Compact status pill used across every Clients table. Tinted background +
 * colored label, driven entirely by theme palette tokens so all tables stay
 * visually consistent.
 */
export function StatusChip({
  label,
  tone = 'neutral',
  dropdown = false,
  sx,
  ...rest
}: StatusChipProps) {
  return (
    <Box
      {...rest}
      component="span"
      sx={[
        (theme: Theme) => {
          const main = toneMain(theme, tone);
          return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.25,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: alpha(main, 0.12),
            color: main,
            whiteSpace: 'nowrap',
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="caption"
        component="span"
        fontWeight={600}
        color="inherit"
      >
        {label}
      </Typography>
      {dropdown && <KeyboardArrowDownIcon fontSize="small" color="inherit" />}
    </Box>
  );
}
