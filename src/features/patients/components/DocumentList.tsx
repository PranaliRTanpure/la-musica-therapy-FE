import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import { SelectableCard } from '@/components/common/SelectableCard';
import { StatusChip } from '@/components/common/StatusChip';
import { formatShortDate } from '@/utils/date';
import type { PatientDocument } from '../types';

export interface DocumentListProps {
  documents: PatientDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
  sx?: SxProps<Theme>;
}

/** Selectable list of uploaded chart documents. */
export function DocumentList({
  documents,
  selectedId,
  onSelect,
  sx,
}: DocumentListProps) {
  return (
    <Stack spacing={1.5} role="group" aria-label="Documents" sx={sx}>
      {documents.map((doc) => (
        <SelectableCard
          key={doc.id}
          selected={doc.id === selectedId}
          onClick={() => onSelect(doc.id)}
          title={doc.title}
          chip={<StatusChip label={doc.source.label} tone={doc.source.tone} />}
          meta={`Uploaded on & by: ${formatShortDate(doc.uploadedOn)}, ${doc.uploadedBy}`}
        />
      ))}
    </Stack>
  );
}
