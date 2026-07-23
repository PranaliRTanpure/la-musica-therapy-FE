import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '@/components/common/NameLink';
import { ProspectActions } from './components/ProspectActions';
import { ScheduleTrialDialog } from './components/ScheduleTrialDialog';
import { PROSPECTS } from '../data';
import type { ProspectRow } from '../types';
import { patientChartPath } from '@/config/routes';

const columns: DataTableColumn<ProspectRow>[] = [
  {
    id: 'name',
    label: 'Prospect Name',
    render: (r) => <NameLink to={patientChartPath(r.id)}>{r.name}</NameLink>,
  },
  { id: 'phone', label: 'Phone Number', render: (r) => r.phone },
  { id: 'email', label: 'Email', render: (r) => r.email },
  { id: 'language', label: 'Language', render: (r) => r.language },
  { id: 'source', label: 'Source', render: (r) => r.source },
  {
    id: 'paymentSource',
    label: 'Payment Source',
    render: (r) => r.paymentSource,
  },
  {
    id: 'status',
    label: 'Status',
    render: (r) => (
      <StatusChip
        label={r.status.label}
        tone={r.status.tone}
        dropdown={r.status.dropdown}
      />
    ),
  },
];

interface ProspectsTabProps {
  /** Rows to display; defaults to all prospects. Parent passes the paged slice. */
  rows?: ProspectRow[];
}

export function ProspectsTab({ rows = PROSPECTS }: ProspectsTabProps) {
  const navigate = useNavigate();
  const [trialProspect, setTrialProspect] = useState<ProspectRow | null>(null);
  const [scheduledToastOpen, setScheduledToastOpen] = useState(false);

  return (
    <>
      <DataTable
        ariaLabel="Prospects"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        renderRowActions={(row) => (
          <ProspectActions
            prospectName={row.name}
            onScheduleTrial={() => setTrialProspect(row)}
            onView={() => navigate(`${patientChartPath(row.id)}?mode=view`)}
            onEdit={() => navigate(patientChartPath(row.id))}
          />
        )}
      />

      <ScheduleTrialDialog
        open={trialProspect !== null}
        onClose={() => setTrialProspect(null)}
        prospectName={trialProspect?.name ?? ''}
        onSubmit={() => setScheduledToastOpen(true)}
      />

      <Snackbar
        open={scheduledToastOpen}
        autoHideDuration={3000}
        onClose={() => setScheduledToastOpen(false)}
        message="Trial scheduled"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
