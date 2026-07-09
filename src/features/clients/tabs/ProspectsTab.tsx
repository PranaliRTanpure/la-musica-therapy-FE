import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '../components/NameLink';
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

export function ProspectsTab() {
  return (
    <DataTable
      ariaLabel="Prospects"
      columns={columns}
      rows={PROSPECTS}
      getRowId={(r) => r.id}
    />
  );
}
