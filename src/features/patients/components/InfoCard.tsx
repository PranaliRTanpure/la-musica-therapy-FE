import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface InfoCardProps {
  title: string;
  children: ReactNode;
}

/** A titled white card wrapping a section of the patient chart (Demographics,
 * Contact, …). Border/surface come from the theme's `MuiPaper` overrides. */
export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }}>
      <Typography
        variant="subtitle1"
        sx={(theme) => ({
          fontWeight: theme.typography.fontWeightSemiBold,
          mb: 2,
        })}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
