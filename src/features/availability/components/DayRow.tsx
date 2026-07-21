import { useFieldArray } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FormCheckbox } from '@/components/form/FormCheckbox';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextField } from '@/components/form/FormTextField';
import { LOCATION_OPTIONS, emptySlot } from '../schema';
import type { AvailabilityPreferencesValues } from '../schema';
import { FULL_WIDTH_ON_MOBILE, WORKING_HOURS_GRID } from './workingHoursGrid';

export interface DayRowProps {
  control: Control<AvailabilityPreferencesValues>;
  dayIndex: number;
  label: string;
}

/**
 * One weekday: a checkbox plus one row per time slot. Its own component because
 * `useFieldArray` is a hook and can't be called inside a loop over the days.
 */
export function DayRow({ control, dayIndex, label }: DayRowProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `days.${dayIndex}.slots`,
  });

  /**
   * The schema requires every day to keep at least one slot row, so deleting
   * the last one clears its values instead of removing the row. That matches
   * the design, where the trash icon is never greyed out.
   */
  const removeSlot = (slotIndex: number) => {
    if (fields.length === 1) update(0, emptySlot());
    else remove(slotIndex);
  };

  return (
    <>
      {fields.map((field, slotIndex) => {
        const isFirstSlot = slotIndex === 0;
        const isLastSlot = slotIndex === fields.length - 1;

        return (
          <Box
            key={field.id}
            sx={[
              WORKING_HOURS_GRID,
              {
                py: { xs: 2, md: 1 },
                borderBottom: 1,
                borderColor: 'divider',
              },
            ]}
          >
            <Box sx={FULL_WIDTH_ON_MOBILE}>
              {/* Only the first slot carries the day's checkbox; the day's
                  later slot rows align beneath it. */}
              {isFirstSlot ? (
                <FormCheckbox
                  name={`days.${dayIndex}.enabled`}
                  control={control}
                  label={label}
                />
              ) : null}
            </Box>

            <FormTextField
              name={`days.${dayIndex}.slots.${slotIndex}.startTime`}
              control={control}
              type="time"
              slotProps={{ htmlInput: { 'aria-label': `${label} start time` } }}
            />

            <FormTextField
              name={`days.${dayIndex}.slots.${slotIndex}.endTime`}
              control={control}
              type="time"
              slotProps={{ htmlInput: { 'aria-label': `${label} end time` } }}
            />

            <Box sx={FULL_WIDTH_ON_MOBILE}>
              <FormSelect
                name={`days.${dayIndex}.slots.${slotIndex}.location`}
                control={control}
                options={LOCATION_OPTIONS}
                slotProps={{ htmlInput: { 'aria-label': `${label} location` } }}
              />
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              sx={[
                FULL_WIDTH_ON_MOBILE,
                { justifyContent: { xs: 'flex-end', md: 'flex-start' } },
              ]}
            >
              <Tooltip
                title={fields.length === 1 ? 'Clear slot' : 'Remove slot'}
              >
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removeSlot(slotIndex)}
                  aria-label={`${fields.length === 1 ? 'Clear' : 'Remove'} ${label} slot ${slotIndex + 1}`}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Only the day's last row offers "add another slot". */}
              <Box sx={{ visibility: isLastSlot ? 'visible' : 'hidden' }}>
                <Tooltip title="Add slot">
                  <IconButton
                    size="small"
                    onClick={() => append(emptySlot())}
                    aria-label={`Add a slot to ${label}`}
                    tabIndex={isLastSlot ? 0 : -1}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
        );
      })}
    </>
  );
}
