import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';
import { SelectableCard } from '@/components/common/SelectableCard';
import { StatusChip } from '@/components/common/StatusChip';
import { formatShortDate } from '@/utils/date';
import type { PatientForm } from '../types';

export interface FormListProps {
  forms: PatientForm[];
  selectedId: string;
  onSelect: (id: string) => void;
  sx?: SxProps<Theme>;
}

/** Selectable list of forms sent to the patient, with their completion status. */
export function FormList({ forms, selectedId, onSelect, sx }: FormListProps) {
  return (
    <Stack spacing={1.5} role="group" aria-label="Forms" sx={sx}>
      {forms.map((form) => (
        <SelectableCard
          key={form.id}
          selected={form.id === selectedId}
          onClick={() => onSelect(form.id)}
          title={form.title}
          chip={
            <StatusChip label={form.status.label} tone={form.status.tone} />
          }
          meta={`Sent: ${formatShortDate(form.sentOn)} | Completed On: ${
            // An incomplete form has no date yet — an em dash, not a blank.
            form.completedOn ? formatShortDate(form.completedOn) : '—'
          }`}
        />
      ))}
    </Stack>
  );
}
