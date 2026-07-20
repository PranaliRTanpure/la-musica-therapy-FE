import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SettingsCard } from './components/SettingsCard';
import { SETTINGS_GROUPS } from './data';

/**
 * Settings landing screen: a responsive wall of cards, each grouping a set of
 * configuration links. Static — the groups come from `data.ts`.
 */
export function SettingsPage() {
  return (
    // Full-bleed like ClientsPage / PatientChartingPage — a `Container` would
    // cap the page at 1200px and centre it, leaving gutters on wide screens.
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h5"
        component="h1"
        sx={(theme) => ({
          fontWeight: theme.typography.fontWeightBold,
          mb: { xs: 3, md: 4 },
        })}
      >
        Settings
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          // `auto-fill` keeps cards at their design width and packs as many per
          // row as fit, instead of stretching three cards across a wide screen.
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(16rem, 1fr))',
            md: 'repeat(auto-fill, minmax(16rem, 20rem))',
          },
          // Cards size to their own rows — a one-link card stays short.
          alignItems: 'start',
        }}
      >
        {SETTINGS_GROUPS.map((group) => (
          <SettingsCard key={group.id} group={group} />
        ))}
      </Box>
    </Box>
  );
}
