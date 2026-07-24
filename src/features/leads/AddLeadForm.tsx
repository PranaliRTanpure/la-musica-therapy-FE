import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { FormTextField } from '@/components/form/FormTextField';
import { FormSelect } from '@/components/form/FormSelect';
import { FormCheckbox } from '@/components/form/FormCheckbox';
import { FormCheckboxGroup } from '@/components/form/FormCheckboxGroup';
import { FormSection } from './components/FormSection';
import {
  addLeadDefaults,
  addLeadSchema,
  CONTACT_METHOD_OPTIONS,
  FACILITY_OPTIONS,
  FUNDING_OPTIONS,
  LANGUAGE_OPTIONS,
  MINOR_OPTIONS,
  REGIONAL_CENTER_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  SESSION_DURATION_OPTIONS,
  SOURCE_OPTIONS,
  THERAPIST_OPTIONS,
  type AddLeadFormValues,
} from './schema';

export interface AddLeadFormProps {
  /** Links an external submit button (`<button form={formId} type="submit">`). */
  formId?: string;
  /** When true, hide Section 1's optional fields — required fields only. */
  mandatoryOnly?: boolean;
  /** When true, all fields are disabled and every section is forced open (View mode). */
  readOnly?: boolean;
  /** Called with validated values on submit. */
  onSubmit?: (values: AddLeadFormValues) => void;
}

const HALF = { xs: 12, md: 6 } as const;

/**
 * Add Lead registration form. Reusable across entry points (page, dialog, …):
 * render it with a `formId`, then trigger submit from any button that targets
 * that form id. Owns its RHF state + Zod validation; the surrounding chrome
 * (header, action buttons, mandatory-only toggle) lives with the caller.
 */
export function AddLeadForm({
  formId = 'add-lead-form',
  mandatoryOnly = false,
  readOnly = false,
  onSubmit,
}: AddLeadFormProps) {
  const { control, handleSubmit } = useForm<AddLeadFormValues>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: addLeadDefaults,
    mode: 'onTouched',
  });

  // Section 1 is always open; the rest default closed and toggle independently,
  // in both edit and read-only (View) mode — only the fields are disabled in View.
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });
  const setOpen = (index: number) => (expanded: boolean) =>
    setOpenSections((prev) => ({ ...prev, [index]: expanded }));

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
      noValidate
    >
      {/* 1. Lead (Patient) Details — mandatory, always open */}
      <FormSection
        index={1}
        title="Lead (Patient) Details"
        expanded={mandatoryOnly || readOnly || openSections[1]}
        onToggle={setOpen(1)}
        locked={mandatoryOnly || readOnly}
      >
        <Grid container spacing={2}>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="firstName"
              label="First Name"
              required
              placeholder="First name"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="lastName"
              label="Last Name"
              required
              placeholder="Last name"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="mobileNo"
              label="Mobile No"
              required
              placeholder="Enter number"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="email"
              label="Email"
              required
              placeholder="name@email.com"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="language"
              label="Language"
              required
              placeholder="Select language"
              options={LANGUAGE_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="source"
              label="Source"
              required
              placeholder="Select source"
              options={SOURCE_OPTIONS}
              disabled={readOnly}
            />
          </Grid>

          {(!mandatoryOnly || readOnly) && (
            <>
              <Grid size={HALF}>
                <FormTextField
                  control={control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="MM/DD/YYYY"
                  disabled={readOnly}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={HALF}>
                <FormSelect
                  control={control}
                  name="isMinor"
                  label="Is this lead a minor?"
                  placeholder="No"
                  options={MINOR_OPTIONS}
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={12}>
                <FormTextField
                  control={control}
                  name="homeAddress"
                  label="Home Address"
                  placeholder="Street address"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormTextField
                  control={control}
                  name="city"
                  label="City"
                  placeholder="City"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <FormTextField
                  control={control}
                  name="state"
                  label="State"
                  placeholder="State"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <FormTextField
                  control={control}
                  name="zip"
                  label="Zip"
                  placeholder="Zip"
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={HALF}>
                <FormSelect
                  control={control}
                  name="preferredContactMethod"
                  label="Preferred Contact Method"
                  placeholder="Select method"
                  options={CONTACT_METHOD_OPTIONS}
                  disabled={readOnly}
                />
              </Grid>
              <Grid size={HALF}>
                <FormTextField
                  control={control}
                  name="diagnosis"
                  label="Diagnosis (parent-provided)"
                  placeholder="e.g. Autism Spectrum Disorder"
                  disabled={readOnly}
                />
              </Grid>
            </>
          )}
        </Grid>
      </FormSection>

      {/* 2. Funding & Authorization */}
      <FormSection
        index={2}
        title="Funding & Authorization"
        expanded={openSections[2]}
        onToggle={setOpen(2)}
      >
        <Grid container spacing={2}>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="fundingType"
              label="Funding / Payer Type"
              placeholder="Select funding"
              options={FUNDING_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="regionalCenter"
              label="Regional Center"
              placeholder="Select center"
              options={REGIONAL_CENTER_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="uciNumber"
              label="UCI Number"
              placeholder="From auth"
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="serviceCoordinator"
              label="Service Coordinator"
              placeholder="Name"
              disabled={readOnly}
            />
          </Grid>
        </Grid>
      </FormSection>

      {/* 3. Consents & Policies */}
      <FormSection
        index={3}
        title="Consents & Policies"
        expanded={openSections[3]}
        onToggle={setOpen(3)}
      >
        <Stack>
          <FormCheckbox
            control={control}
            name="hipaaConsent"
            label="HIPAA / Privacy Notice — consent to collect & store protected health information"
            disabled={readOnly}
          />
          <FormCheckbox
            control={control}
            name="contactConsent"
            label="Consent to contact — agree to receive calls and SMS reminders"
            disabled={readOnly}
          />
          <FormCheckbox
            control={control}
            name="paymentPolicy"
            label="Payment & Cancellation Policy"
            disabled={readOnly}
          />
        </Stack>
      </FormSection>

      {/* 4. Service & Scheduling Setup */}
      <FormSection
        index={4}
        title="Service & Scheduling Setup"
        expanded={openSections[4]}
        onToggle={setOpen(4)}
      >
        <Grid container spacing={2}>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="assignedFacility"
              label="Assigned Facility"
              placeholder="Select facility"
              options={FACILITY_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="assignedTherapist"
              label="Assigned Therapist"
              placeholder="Select therapist"
              options={THERAPIST_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormSelect
              control={control}
              name="defaultSessionDuration"
              label="Default Session Duration"
              placeholder="Select duration"
              options={SESSION_DURATION_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
          <Grid size={HALF}>
            <FormTextField
              control={control}
              name="icdCodes"
              label="Diagnosis / ICD-10 Code(s)"
              placeholder="e.g. F84.0"
              disabled={readOnly}
            />
          </Grid>

          <Grid size={12}>
            <Typography
              variant="body2"
              sx={(theme) => ({
                fontWeight: theme.typography.fontWeightSemiBold,
                mb: 1,
              })}
            >
              Assigned Service Types
            </Typography>
            <FormCheckboxGroup
              control={control}
              name="serviceTypes"
              options={SERVICE_TYPE_OPTIONS}
              disabled={readOnly}
            />
          </Grid>
        </Grid>
      </FormSection>
    </Box>
  );
}
