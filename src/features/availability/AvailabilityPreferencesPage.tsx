import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppButton } from '@/components/common/AppButton';
import { AppTabs } from '@/components/common/AppTabs';
import { StatusChip } from '@/components/common/StatusChip';
import { DayRow } from './components/DayRow';
import { WORKING_HOURS_GRID } from './components/workingHoursGrid';
import { AVAILABILITY_ROWS, defaultPreferences } from './data';
import { DAYS, availabilityPreferencesSchema } from './schema';
import type { AvailabilityPreferencesValues } from './schema';

const TABS = [{ label: 'Day Slots' }, { label: 'Block Days' }];
const TAB_DAY_SLOTS = 0;

/** Column headers, shown only where the row renders as a grid (md and up). */
const COLUMNS = ['Day', 'Start Time', 'End Time', 'Location'];

/**
 * Settings → Availability → a provider's preferences. Static: the form starts
 * from sample data and logs on submit until the API lands.
 */
export function AvailabilityPreferencesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState(TAB_DAY_SLOTS);
  const [expanded, setExpanded] = useState(true);

  const provider = AVAILABILITY_ROWS.find((row) => row.id === id);

  const { control, handleSubmit, formState } =
    useForm<AvailabilityPreferencesValues>({
      resolver: zodResolver(availabilityPreferencesSchema),
      defaultValues: defaultPreferences(),
      // Ticking a day must surface its missing times immediately, not only on
      // submit — that's the whole point of the conditional requirement.
      mode: 'onChange',
    });

  const onSubmit = (values: AvailabilityPreferencesValues) => {
    // Static phase: the API mutation lands here.
    void values;
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ p: { xs: 2, md: 3 } }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ minWidth: 0 }}
        >
          <IconButton
            aria-label="Back to availability"
            onClick={() => navigate(-1)}
            sx={{ flexShrink: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="h1"
            sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
          >
            Availability Preferences
          </Typography>
          {provider ? (
            <StatusChip label={provider.name} tone="warning" />
          ) : null}
          <AppTabs
            ariaLabel="Availability section"
            items={TABS}
            value={tab}
            onChange={setTab}
          />
        </Stack>

        <AppButton
          type="submit"
          variant="contained"
          disabled={formState.isSubmitting}
          sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', lg: 'center' } }}
        >
          Save Changes
        </AppButton>
      </Stack>

      {tab === TAB_DAY_SLOTS ? (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2 }}
          >
            <Typography
              variant="subtitle1"
              component="h2"
              sx={(theme) => ({
                fontWeight: theme.typography.fontWeightBold,
              })}
            >
              Working Hours
            </Typography>
            <IconButton
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              aria-controls="working-hours-panel"
              aria-label={
                expanded ? 'Collapse working hours' : 'Expand working hours'
              }
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Divider />

          <Collapse in={expanded}>
            <Box id="working-hours-panel">
              {/* Shaded header band, full-bleed. Hidden below `md`, where each
                  row stacks and the fields carry their own aria-labels. */}
              <Box
                sx={[
                  WORKING_HOURS_GRID,
                  {
                    display: { xs: 'none', md: 'grid' },
                    py: 1.5,
                    bgcolor: 'background.default',
                    borderBottom: 1,
                    borderColor: 'divider',
                  },
                ]}
              >
                {COLUMNS.map((column) => (
                  <Typography
                    key={column}
                    variant="body2"
                    color="text.secondary"
                  >
                    {column}
                  </Typography>
                ))}
                <Box />
              </Box>

              {DAYS.map((day, dayIndex) => (
                <DayRow
                  key={day}
                  control={control}
                  dayIndex={dayIndex}
                  label={day}
                />
              ))}
            </Box>
          </Collapse>
        </Paper>
      ) : (
        <Paper
          sx={{ borderRadius: 2, p: { xs: 3, md: 6 }, textAlign: 'center' }}
        >
          <Typography variant="body2" color="text.secondary">
            Block Days coming soon.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
