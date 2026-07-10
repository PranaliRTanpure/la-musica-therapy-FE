import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { StatusChip } from '@/components/common/StatusChip';
import { formatShortDate } from '@/utils/date';
import type { PatientDocument } from '../types';

export interface DocumentListProps {
  documents: PatientDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
  sx?: SxProps<Theme>;
}

/** Selectable list of chart documents; the active card is tinted and outlined. */
export function DocumentList({
  documents,
  selectedId,
  onSelect,
  sx,
}: DocumentListProps) {
  return (
    <Stack spacing={1.5} role="group" aria-label="Documents" sx={sx}>
      {documents.map((doc) => {
        const selected = doc.id === selectedId;
        return (
          // Toggle buttons, not a listbox: `listbox` would promise arrow-key
          // focus management that these individually-tabbable cards don't do.
          <ButtonBase
            key={doc.id}
            aria-pressed={selected}
            onClick={() => onSelect(doc.id)}
            sx={(theme) => ({
              display: 'block',
              textAlign: 'left',
              width: '100%',
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: selected
                ? alpha(theme.palette.primary.main, 0.06)
                : 'background.paper',
              transition: theme.transitions.create([
                'background-color',
                'border-color',
              ]),
              '&:hover': {
                borderColor: selected ? 'primary.main' : 'text.disabled',
              },
            })}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography
                variant="body2"
                noWrap
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightSemiBold,
                  // Lets the title ellipsis instead of pushing the chip out.
                  minWidth: 0,
                })}
              >
                {doc.title}
              </Typography>
              <StatusChip
                label={doc.source.label}
                tone={doc.source.tone}
                sx={{ flexShrink: 0 }}
              />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: 'block', mt: 1 }}
            >
              Uploaded on &amp; by: {formatShortDate(doc.uploadedOn)},{' '}
              {doc.uploadedBy}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
