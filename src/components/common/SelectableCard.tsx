import type { ReactNode } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import { alpha } from '@mui/material/styles';

export interface SelectableCardProps extends Omit<ButtonBaseProps, 'title'> {
  selected?: boolean;
  /** Primary line; ellipsises rather than pushing `chip` out of the card. */
  title: string;
  /** Trailing badge, e.g. a `StatusChip`. */
  chip?: ReactNode;
  /** Secondary caption line beneath the title. */
  meta?: ReactNode;
}

/**
 * A selectable summary card: title, trailing chip, caption. Selection tints the
 * surface and outlines it in the primary color.
 *
 * A toggle button, not a listbox option — `role="listbox"` would promise
 * arrow-key focus management these individually-tabbable cards don't implement.
 */
export function SelectableCard({
  selected = false,
  title,
  chip,
  meta,
  sx,
  ...rest
}: SelectableCardProps) {
  return (
    <ButtonBase
      aria-pressed={selected}
      sx={[
        (theme) => ({
          display: 'block',
          textAlign: 'left',
          width: '100%',
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: selected ? 'primary.main' : 'divider',
          bgcolor: selected
            ? alpha(theme.palette.primary.main, 0.06)
            : 'background.paper',
          transition: theme.transitions.create([
            'background-color',
            'border-color',
          ]),
          '&:hover': {
            borderColor: selected ? 'primary.main' : 'text.disabled',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography
          variant="body2"
          noWrap
          sx={(theme) => ({
            fontWeight: theme.typography.fontWeightSemiBold,
            minWidth: 0,
          })}
        >
          {title}
        </Typography>
        {chip ? <Stack sx={{ flexShrink: 0 }}>{chip}</Stack> : null}
      </Stack>
      {meta ? (
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: 'block', mt: 1 }}
        >
          {meta}
        </Typography>
      ) : null}
    </ButtonBase>
  );
}
