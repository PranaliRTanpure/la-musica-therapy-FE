import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export interface PlaceholderPageProps {
  title: string;
}

/**
 * Temporary route target so the Sidebar's links resolve and its active state
 * works before the real screens are built. Replace per-route as screens land.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" component="h1">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        This screen is a placeholder — content coming soon.
      </Typography>
    </Container>
  );
}
