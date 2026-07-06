import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// MUI v6: the new Grid with the `size` prop is exported as Grid2.
import Grid from '@mui/material/Grid2';

/**
 * REFERENCE PATTERN for a static screen. Copy this structure.
 *
 * Rules demonstrated here:
 * - No hardcoded colors/spacing/radii — everything comes from the theme
 *   (sx spacing keys like p/gap map to theme.spacing; color strings like
 *   'text.secondary' / 'primary.main' resolve from the palette).
 * - Responsive via MUI breakpoints: sx values as objects { xs, sm, md, ... }
 *   and Grid `size` props that change per breakpoint.
 * - Layout via Container / Stack / Grid / Box — not manual CSS.
 * - Static only: no data fetching yet. When APIs arrive, data flows into these
 *   same components as props; the layout doesn't change.
 */
export function ExampleScreen() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Page header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        <Box>
          <Typography variant="h3" component="h1">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your workspace
          </Typography>
        </Box>
        <Button variant="contained" color="primary">
          New Item
        </Button>
      </Stack>

      {/* Stat cards — responsive grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {['Total', 'Active', 'Pending', 'Archived'].map((label) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h4" component="p" sx={{ mt: 1 }}>
                  —
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* A form section demonstrating themed inputs */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Quick add
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Name" placeholder="Enter a name" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Email" placeholder="name@example.com" />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Notes"
                placeholder="Optional"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained">Save</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
