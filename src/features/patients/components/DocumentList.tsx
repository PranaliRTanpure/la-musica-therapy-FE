import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { StatusChip } from '@/components/common/StatusChip';
import type { PatientFormDocument } from '../types';

export interface DocumentListProps {
  documents: PatientFormDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
  sx?: SxProps<Theme>;
}

/** Selectable list of chart documents; the active card gets a primary border. */
export function DocumentList({
  documents,
  selectedId,
  onSelect,
  sx,
}: DocumentListProps) {
  return (
    <Stack spacing={1.5} sx={sx}>
      {documents.map((doc) => {
        const selected = doc.id === selectedId;
        return (
          <ButtonBase
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            sx={{
              display: 'block',
              textAlign: 'left',
              width: '100%',
              borderRadius: 2,
              border: 1,
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: 'background.paper',
              p: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                {doc.title}
              </Typography>
              <StatusChip label={doc.status.label} tone={doc.status.tone} />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              Sent: {doc.sentOn} &nbsp;|&nbsp; Completed On:{' '}
              {doc.completedOn ?? '—'}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
