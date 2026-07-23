import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppButton } from '@/components/common/AppButton';
import { ROUTES } from '@/config/routes';
import { AddLeadForm } from './AddLeadForm';
import type { AddLeadFormValues } from './schema';

const FORM_ID = 'add-lead-form';

/**
 * Full-page entry point for the lead form. Reached from the "Add Leads" button
 * (create) or by clicking a lead's name in the list (`/clients/leads/:id`,
 * edit). The page owns the header chrome — back, title, the mandatory-only
 * toggle, and the action buttons — while `AddLeadForm` owns the fields + RHF
 * state. "Save and Share Link" submits the form via the shared `form` id.
 *
 * In edit mode the `id` identifies the lead; once the API is wired, fetch it
 * with a GET and reset the form with the response to autopatch the fields.
 */
export function AddLeadPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const isView = isEdit && searchParams.get('mode') === 'view';
  // Create: default to mandatory-only. Edit: show the full form to review/update.
  const [mandatoryOnly, setMandatoryOnly] = useState(!isEdit);

  const handleSubmit = (_values: AddLeadFormValues) => {
    // Static phase: no persistence yet. Return to the list on a valid submit.
    navigate(ROUTES.CLIENTS);
  };

  const title = isView
    ? 'Lead Details'
    : isEdit
      ? 'Lead Registration'
      : 'New Lead Registration';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="Back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
        >
          {isView ? (
            <AppButton
              variant="contained"
              onClick={() => navigate(ROUTES.CLIENTS)}
            >
              Close
            </AppButton>
          ) : (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={mandatoryOnly}
                    onChange={(e) => setMandatoryOnly(e.target.checked)}
                  />
                }
                label="Show mandatory fields only"
                slotProps={{ typography: { variant: 'body2' } }}
              />
              <AppButton
                variant="outlined"
                onClick={() => navigate(ROUTES.CLIENTS)}
              >
                Cancel
              </AppButton>
              <AppButton type="submit" form={FORM_ID} variant="contained">
                {isEdit ? 'Update' : 'Save and Share Link'}
              </AppButton>
            </>
          )}
        </Stack>
      </Stack>

      {/* Form — full width; the page's padding provides the outer gutter. */}
      <AddLeadForm
        formId={FORM_ID}
        mandatoryOnly={mandatoryOnly}
        readOnly={isView}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
