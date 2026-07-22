import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import heroImage from '@/assets/hero-therapy-session.png';

export interface AuthSplitLayoutProps {
  /** The sign-in form (and anything above/below it) for the right-hand column. */
  children: ReactNode;
}

// Shared shell for auth screens: hero photo left (hidden below `md`), form + footer right.
export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        minHeight: { xs: 'auto', md: ['100vh', '100dvh'] },
        height: { md: ['100vh', '100dvh'] },
        bgcolor: 'background.paper',
      }}
    >
      <Box
        component="img"
        src={heroImage}
        alt=""
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: { md: '50%', lg: '50%' },
          height: '100%',
          minHeight: '48px',
          alignSelf: 'stretch',
          objectFit: 'cover',
          objectPosition: 'center',
          p: { xs: 0.5, sm: 2 },
          backgroundColor: 'background.default',
          borderRadius: 3,
        }}
      />

      <Stack
        sx={{
          flex: 1,
          minHeight: { md: ['100vh', '100dvh'] },
          height: { md: ['100vh', '100dvh'] },
          overflowY: { md: 'auto' },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, sm: 6, md: 8 },
            py: { xs: 4, md: 5 },
          }}
        >
          {children}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center', pb: 3, fontWeight: 500 }}
        >
          © 2026. LA Musica Therapy. All rights reserved
        </Typography>
      </Stack>
    </Stack>
  );
}
