import type { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

export interface LabeledValueProps {
  label: string;
  value: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Read-only label/value pair: a muted caption label above a semibold value.
 * The shared building block for detail/summary screens (patient charting,
 * profile views, etc.). Empty values render an em dash.
 */
export function LabeledValue({ label, value, sx }: LabeledValueProps) {
  // Only null/undefined/'' are absent. `0` and `false` are real values and
  // must render as themselves, so a falsy check (`||`) is not safe here.
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <Stack spacing={0.5} sx={sx}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={(theme) => ({
          fontWeight: theme.typography.fontWeightBold,
          // Long unbroken values (emails, ids) wrap instead of overflowing.
          overflowWrap: 'anywhere',
        })}
      >
        {isEmpty ? '—' : value}
      </Typography>
    </Stack>
  );
}
