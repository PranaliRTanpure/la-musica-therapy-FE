import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { AppButton } from '@/components/common/AppButton';
import { AppTextField } from '@/components/common/AppTextField';
import { FieldLabel } from '@/components/common/FieldLabel';
import { FormSelect } from '@/components/form/FormSelect';
import { FormTextField } from '@/components/form/FormTextField';
import { MonthCalendar } from '@/components/common/MonthCalendar';
import { TimeSlotList } from '@/components/common/TimeSlotList';
import {
  FACILITY_OPTIONS,
  SESSION_DURATION_OPTIONS,
  THERAPIST_OPTIONS,
} from '@/features/leads/schema';
import { buildTimeSlots } from './timeSlots';
import { emptyScheduleTrial, scheduleTrialSchema } from './scheduleTrialSchema';
import type { ScheduleTrialFormValues } from './scheduleTrialSchema';

export interface ScheduleTrialDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ScheduleTrialFormValues) => void;
  /** Shown read-only in the "Patient" field. */
  prospectName: string;
}

/** Schedules a trial session for a prospect: therapist, facility, duration, a date + time slot, and optional notes. */
export function ScheduleTrialDialog({
  open,
  onClose,
  onSubmit,
  prospectName,
}: ScheduleTrialDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const timeSlots = useMemo(() => buildTimeSlots(), []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<ScheduleTrialFormValues>({
    resolver: zodResolver(scheduleTrialSchema),
    defaultValues: emptyScheduleTrial,
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) reset(emptyScheduleTrial);
  }, [open, reset]);

  const submit = (values: ScheduleTrialFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      aria-labelledby="schedule-trial-title"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle
          id="schedule-trial-title"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={(t) => ({ fontWeight: t.typography.fontWeightBold })}
          >
            Schedule Trial
          </Typography>
          <IconButton onClick={onClose} aria-label="Close dialog" edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12}>
              <AppTextField label="Patient" value={prospectName} disabled />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelect
                name="therapist"
                control={control}
                label="Therapist"
                placeholder="Select any available therapist"
                options={THERAPIST_OPTIONS}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelect
                name="facility"
                control={control}
                label="Facility"
                placeholder="Select Facility"
                options={FACILITY_OPTIONS}
              />
            </Grid>

            <Grid size={12}>
              <FieldLabel label="Date & Time" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <FormSelect
                name="duration"
                control={control}
                label="Duration"
                options={SESSION_DURATION_OPTIONS}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 7 }} />

            <Grid size={{ xs: 12, sm: 7 }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <MonthCalendar
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{ xs: 12, sm: 5 }}
              sx={{ maxHeight: 360, overflowY: 'auto' }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Available Time Slots
              </Typography>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimeSlotList
                    slots={timeSlots}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <FormTextField
                name="notes"
                control={control}
                label="Notes"
                placeholder="Add notes..."
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5, flexWrap: 'wrap' }}>
          <AppButton
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
          >
            Book Appointment
          </AppButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
