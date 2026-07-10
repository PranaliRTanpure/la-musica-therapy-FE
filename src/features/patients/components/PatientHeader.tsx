import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StatusChip } from '@/components/common/StatusChip';
import type { PatientChart } from '../types';

export interface PatientHeaderProps {
  patient: PatientChart;
  onBack: () => void;
}

/** Top band of the chart: back, avatar, name + id + status, key meta, Edit. */
export function PatientHeader({ patient, onBack }: PatientHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={2}
      sx={{ p: { xs: 2, md: 2 } }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, md: 2 }}
        sx={{ minWidth: 0, width: '100%' }}
      >
        <IconButton aria-label="Back" onClick={onBack} sx={{ flexShrink: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            flexShrink: 0,
          }}
        >
          {patient.name.charAt(0)}
        </Avatar>
        {/* minWidth:0 lets the meta rows wrap instead of overflowing on mobile */}
        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              variant="h6"
              component="h1"
              sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
            >
              {patient.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({patient.patientId})
            </Typography>
            <StatusChip
              label={patient.status.label}
              tone={patient.status.tone}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 0.5 }}
          >
            <Typography variant="body2" color="text.secondary">
              DOB: {patient.dateOfBirth} ({patient.ageYears} yrs)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.language}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Button
        variant="outlined"
        sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', md: 'center' } }}
      >
        Edit
      </Button>
    </Stack>
  );
}
