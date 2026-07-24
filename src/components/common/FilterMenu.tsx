import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/** A single selectable checkbox option within a filter group. */
export interface FilterOption {
  label: string;
  value: string;
}

/** A titled group of checkbox options (e.g. "Source"). */
export interface FilterGroup {
  /** Stable key used to index the selection map. */
  key: string;
  /** Section heading (rendered uppercase). */
  label: string;
  options: FilterOption[];
}

/** Selected option values, keyed by `FilterGroup.key`. */
export type FilterSelection = Record<string, string[]>;

export interface FilterMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** Groups of checkbox options to show. */
  groups: FilterGroup[];
  /** Controlled selection, keyed by group key. */
  selected: FilterSelection;
  onChange: (selected: FilterSelection) => void;
  /** Called when "Clear" is pressed (after the selection is emptied). */
  onClear?: () => void;
  /** Called when "Done" is pressed (before the menu closes). */
  onApply?: () => void;
}

/**
 * Reusable filter popover: renders one or more groups of checkbox options with
 * Clear / Done actions, anchored to a trigger (e.g. a toolbar filter button).
 * Presentational and controlled — the parent owns `selected` and reacts to
 * `onChange`; this component holds no filter state of its own, so the same
 * popover serves any list by passing different `groups`.
 */
export function FilterMenu({
  open,
  anchorEl,
  onClose,
  groups,
  selected,
  onChange,
  onClear,
  onApply,
}: FilterMenuProps) {
  const toggle = (groupKey: string, value: string) => {
    const current = selected[groupKey] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...selected, [groupKey]: next });
  };

  const handleClear = () => {
    onChange({});
    onClear?.();
  };

  const handleApply = () => {
    onApply?.();
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: (theme) => theme.spacing(28),
            boxShadow: 3,
          },
        },
      }}
    >
      <Stack divider={<Divider sx={{ borderColor: 'divider' }} />}>
        {groups.map((group) => (
          <Box key={group.key} sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', fontWeight: 600, mb: 0 }}
            >
              {group.label}
            </Typography>
            <FormGroup>
              {group.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  sx={{ ml: -1, minHeight: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={(selected[group.key] ?? []).includes(
                        option.value
                      )}
                      onChange={() => toggle(group.key, option.value)}
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={option.label}
                  slotProps={{ typography: { variant: 'body2' } }}
                />
              ))}
            </FormGroup>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ borderColor: 'divider' }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.5 }}
      >
        <Button
          variant="text"
          onClick={handleClear}
          sx={(theme) => ({
            color: 'text.secondary',
            fontSize: theme.typography.actionSmall.fontSize,
            fontWeight: theme.typography.actionSmall.fontWeight,
          })}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          sx={(theme) => ({
            fontSize: theme.typography.actionSmall.fontSize,
            fontWeight: theme.typography.actionSmall.fontWeight,
          })}
        >
          Done
        </Button>
      </Stack>
    </Popover>
  );
}
