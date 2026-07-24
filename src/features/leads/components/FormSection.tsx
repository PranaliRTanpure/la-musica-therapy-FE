import type { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha } from '@mui/material/styles';

export interface FormSectionProps {
  /** 1-based step number shown in the badge. */
  index: number;
  title: string;
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  /** When true the section is locked open (no expand control) — used for the
   * mandatory first section. */
  locked?: boolean;
  children: ReactNode;
}

/**
 * One collapsible form section rendered as a numbered accordion card. Presentational
 * and controlled (`expanded` + `onToggle`); the parent decides which sections
 * are open and whether a section is locked open.
 */
export function FormSection({
  index,
  title,
  expanded,
  onToggle,
  locked = false,
  children,
}: FormSectionProps) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_e, isExpanded) => !locked && onToggle(isExpanded)}
      sx={{
        borderRadius: 1,
        mb: 2,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={locked ? null : <ExpandMoreIcon />}
        sx={{ px: { xs: 2, md: 3 }, cursor: locked ? 'default' : 'pointer' }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={(theme) => ({
              width: theme.spacing(3),
              height: theme.spacing(3),
              borderRadius: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: theme.typography.caption.fontSize,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            })}
          >
            {index}
          </Box>
          <Typography
            variant="subtitle1"
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: theme.typography.pxToRem(14),
            })}
          >
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
