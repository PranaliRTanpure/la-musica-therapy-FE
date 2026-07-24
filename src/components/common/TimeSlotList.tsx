import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export interface TimeSlotOption {
  /** Stable value submitted on select, e.g. `'09:00'`. */
  value: string;
  /** Display label, e.g. `'9:00 - 9:30 AM'`. */
  label: string;
}

export interface TimeSlotListProps {
  slots: TimeSlotOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Vertical list of selectable time-slot rows (e.g. next to a `MonthCalendar`).
 * Presentational and controlled — the parent supplies `slots` and owns
 * `value`.
 */
export function TimeSlotList({ slots, value, onChange }: TimeSlotListProps) {
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusedValue = value || slots[0]?.value;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const deltas: Record<string, number> = {
      ArrowUp: -1,
      ArrowLeft: -1,
      ArrowDown: 1,
      ArrowRight: 1,
    };
    const delta = deltas[event.key];
    if (delta === undefined || slots.length === 0) return;

    event.preventDefault();
    const nextIndex = (index + delta + slots.length) % slots.length;
    const next = slots[nextIndex];
    onChange(next.value);
    optionRefs.current.get(next.value)?.focus();
  };

  return (
    <Stack spacing={1} role="radiogroup" aria-label="Available time slots">
      {slots.map((slot, index) => {
        const selected = slot.value === value;
        return (
          <ButtonBase
            key={slot.value}
            ref={(node: HTMLButtonElement | null) => {
              if (node) {
                optionRefs.current.set(slot.value, node);
              } else {
                optionRefs.current.delete(slot.value);
              }
            }}
            role="radio"
            aria-checked={selected}
            tabIndex={slot.value === focusedValue ? 0 : -1}
            onClick={() => onChange(slot.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            sx={{
              justifyContent: 'flex-start',
              px: 2,
              py: 1.25,
              minHeight: 44,
              borderRadius: 1,
              border: '1px solid',
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: (theme) =>
                selected
                  ? alpha(theme.palette.primary.main, 0.08)
                  : theme.palette.background.paper,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: selected ? 600 : 400 }}
            >
              {slot.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
