import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface MonthCalendarProps {
  /** Selected date as an ISO `yyyy-MM-dd` string, or `''` for none. */
  value: string;
  onChange: (isoDate: string) => void;
  /** Dates before this ISO date (if given) render disabled. Defaults to none. */
  minDate?: string;
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Month-grid date picker: prior/next month navigation, a week-starts-Monday
 * grid, and a single selected day highlighted. Presentational and controlled
 * — the parent owns `value`; this holds only which month is currently shown.
 */
export function MonthCalendar({
  value,
  onChange,
  minDate,
}: MonthCalendarProps) {
  const selectedDate = value ? parseISO(value) : null;
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date()
  );
  const [focusedDate, setFocusedDate] = useState(
    () => selectedDate ?? new Date()
  );
  const minDateValue = minDate ? parseISO(minDate) : null;
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());

  const gridStart = startOfWeek(startOfMonth(visibleMonth), {
    weekStartsOn: 1,
  });
  const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const isDisabledDay = (day: Date) =>
    minDateValue ? day < minDateValue && !isSameDay(day, minDateValue) : false;

  const focusDay = (day: Date) => {
    setFocusedDate(day);
    if (!isSameMonth(day, visibleMonth)) {
      setVisibleMonth(day);
    }
    const iso = format(day, 'yyyy-MM-dd');
    // Focus after the potential month re-render commits the new button node.
    requestAnimationFrame(() => dayButtonRefs.current.get(iso)?.focus());
  };

  const handleDayKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    day: Date
  ) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const delta = deltas[event.key];
    if (delta !== undefined) {
      event.preventDefault();
      const next = addDays(day, delta);
      if (!isDisabledDay(next)) {
        focusDay(next);
      }
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <IconButton
          size="small"
          aria-label="Previous month"
          onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {format(visibleMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton
          size="small"
          aria-label="Next month"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box role="grid" aria-label="calendar">
        <Box
          role="row"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {WEEKDAY_LABELS.map((label) => (
            <Typography
              key={label}
              role="columnheader"
              variant="caption"
              align="center"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        {weeks.map((week) => (
          <Box
            key={week[0].toISOString()}
            role="row"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {week.map((day) => {
              const inMonth = isSameMonth(day, visibleMonth);
              const isSelected = selectedDate
                ? isSameDay(day, selectedDate)
                : false;
              const isDisabled = isDisabledDay(day);
              const iso = format(day, 'yyyy-MM-dd');
              const isFocusable = isSameDay(day, focusedDate);

              return (
                <Box key={iso} role="gridcell">
                  <Box
                    ref={(node: HTMLButtonElement | null) => {
                      if (node) {
                        dayButtonRefs.current.set(iso, node);
                      } else {
                        dayButtonRefs.current.delete(iso);
                      }
                    }}
                    component="button"
                    type="button"
                    disabled={isDisabled}
                    tabIndex={isFocusable ? 0 : -1}
                    aria-selected={isSelected}
                    onClick={() => {
                      setFocusedDate(day);
                      onChange(iso);
                    }}
                    onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) =>
                      handleDayKeyDown(event, day)
                    }
                    aria-label={format(day, 'MMMM d, yyyy')}
                    sx={{
                      minHeight: 44,
                      minWidth: 44,
                      width: '100%',
                      border: 'none',
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected
                        ? 'primary.contrastText'
                        : inMonth
                          ? 'text.primary'
                          : 'text.disabled',
                      cursor: isDisabled ? 'default' : 'pointer',
                      opacity: isDisabled ? 0.4 : 1,
                      font: 'inherit',
                      fontWeight: isSelected ? 600 : 400,
                      '&:hover': {
                        bgcolor: isSelected
                          ? 'primary.main'
                          : isDisabled
                            ? 'transparent'
                            : 'action.hover',
                      },
                    }}
                  >
                    {format(day, 'd')}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
