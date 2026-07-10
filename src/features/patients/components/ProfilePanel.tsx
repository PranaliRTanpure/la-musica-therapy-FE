import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { LabeledValue } from '@/components/common/LabeledValue';
import { InfoCard } from './InfoCard';
import type { ProfileColumns, ProfileSection } from '../types';

/**
 * Column count → responsive `Grid` size. Every section collapses toward a
 * single column on narrow screens; only the desktop density differs.
 */
const GRID_SIZE: Record<
  ProfileColumns,
  { xs: number; sm: number; md: number }
> = {
  2: { xs: 12, sm: 12, md: 6 },
  3: { xs: 12, sm: 6, md: 4 },
  4: { xs: 6, sm: 4, md: 3 },
};

export interface ProfilePanelProps {
  sections: ProfileSection[];
}

/**
 * The Profile tab: a stack of titled cards, each a responsive grid of
 * read-only fields. Section titles, field order, and column density all come
 * from the data, so the API can add a section without touching this file.
 */
export function ProfilePanel({ sections }: ProfilePanelProps) {
  return (
    <Stack spacing={2}>
      {sections.map((section) => {
        const size = GRID_SIZE[section.columns ?? 4];
        return (
          <InfoCard key={section.id} title={section.title}>
            <Grid container spacing={2}>
              {section.fields.map((field) => (
                <Grid key={field.label} size={size}>
                  <LabeledValue label={field.label} value={field.value} />
                </Grid>
              ))}
            </Grid>
          </InfoCard>
        );
      })}
    </Stack>
  );
}
