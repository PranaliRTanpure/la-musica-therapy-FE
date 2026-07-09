import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LabeledValue } from '@/components/common/LabeledValue';
import { InfoCard } from './InfoCard';
import type { PatientChart } from '../types';

export interface FormDetailProps {
  patient: PatientChart;
  title: string;
}

/** The selected form's read-only content: Demographics + Contact info cards. */
export function FormDetail({ patient, title }: FormDetailProps) {
  const d = patient.demographics;
  const c = patient.contact;

  const demographics: [string, string][] = [
    ['First Name', d.firstName],
    ['Middle Name', d.middleName],
    ['Last Name', d.lastName],
    ['Preferred Name', d.preferredName],
    ['Date of Birth', d.dateOfBirth],
    ['Gender', d.gender],
    ['Pronouns', d.pronouns],
    ['Time Zone', d.timeZone],
    ['Language Spoken', d.languageSpoken],
    ['Race', d.race],
    ['Ethnicity', d.ethnicity],
    ['Marital Status', d.maritalStatus],
    ['Diagnosis', d.diagnosis],
    ['Patient ID', d.patientId],
  ];

  const contact: [string, string][] = [
    ['Mobile Number', c.mobileNumber],
    ['Home Phone Number', c.homePhoneNumber],
    ['Email ID', c.emailId],
    ['Fax Number', c.faxNumber],
    ['Address', c.address],
    ['Payment Source', c.paymentSource],
  ];

  return (
    <Stack spacing={2}>
      <Typography
        variant="subtitle1"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemiBold })}
      >
        {title}
      </Typography>

      <InfoCard title="Demographics Info">
        <Grid container spacing={2}>
          {demographics.map(([label, value]) => (
            <Grid key={label} size={{ xs: 6, sm: 4, md: 2 }}>
              <LabeledValue label={label} value={value} />
            </Grid>
          ))}
        </Grid>
      </InfoCard>

      <InfoCard title="Contact Info">
        <Grid container spacing={2}>
          {contact.map(([label, value]) => (
            <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
              <LabeledValue label={label} value={value} />
            </Grid>
          ))}
        </Grid>
      </InfoCard>
    </Stack>
  );
}
