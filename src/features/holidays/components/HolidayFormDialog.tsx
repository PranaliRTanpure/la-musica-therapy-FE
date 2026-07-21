import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
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
import { FormTextField } from '@/components/form/FormTextField';
import { emptyHoliday, holidaySchema } from '../schema';
import type { HolidayFormValues } from '../schema';
import type { HolidayRow } from '../types';

export interface HolidayFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: HolidayFormValues) => void;
  /** Pass a row to edit it; omit (or `null`) to add a new holiday. */
  holiday?: HolidayRow | null;
}

/** The row's persisted fields, minus the ones the form doesn't own. */
function toFormValues(
  holiday: HolidayRow | null | undefined
): HolidayFormValues {
  if (!holiday) return emptyHoliday;
  return {
    title: holiday.title,
    date: holiday.date,
    description: holiday.description,
  };
}

/**
 * Add / Edit Holiday. One form for both: passing a `holiday` seeds the fields
 * and switches the copy, so the schema and layout can never drift between the
 * two flows.
 */
export function HolidayFormDialog({
  open,
  onClose,
  onSubmit,
  holiday = null,
}: HolidayFormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(holiday);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: toFormValues(holiday),
    // Save stays disabled until the required fields are filled.
    mode: 'onChange',
  });

  // Seed the fields whenever the dialog opens, so switching from editing one
  // holiday to adding another never leaves the previous values behind.
  useEffect(() => {
    if (open) reset(toFormValues(holiday));
  }, [open, holiday, reset]);

  const submit = (values: HolidayFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="holiday-form-title"
    >
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle
          id="holiday-form-title"
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
            {isEdit ? 'Edit Holiday' : 'Add Holiday'}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close dialog" edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField
                name="title"
                control={control}
                label="Holiday Title"
                placeholder="Enter Holiday Name"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Native date input: gives the calendar affordance, the MM/DD/YYYY
                  mask in en-US, an OS picker on mobile, and an ISO value. */}
              <FormTextField
                name="date"
                control={control}
                label="Date"
                type="date"
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={12}>
              <FormTextField
                name="description"
                control={control}
                label="Description"
                placeholder="Enter Description..."
                multiline
                minRows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
