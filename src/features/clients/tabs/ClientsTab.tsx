import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '../components/NameLink';
import { CLIENTS } from '../data';
import type { ClientRow } from '../types';

const columns: DataTableColumn<ClientRow>[] = [
  {
    id: 'name',
    label: 'Client Name',
    render: (r) => <NameLink>{r.name}</NameLink>,
  },
  { id: 'phone', label: 'Phone Number', render: (r) => r.phone },
  { id: 'email', label: 'Email', render: (r) => r.email },
  { id: 'language', label: 'Language', render: (r) => r.language },
  { id: 'source', label: 'Source', render: (r) => r.source },
  { id: 'program', label: 'Program', render: (r) => r.program },
  { id: 'condition', label: 'Condition', render: (r) => r.condition },
  {
    id: 'communityCenter',
    label: 'Community Center',
    render: (r) => r.communityCenter,
  },
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

export function ClientsTab() {
  return (
    <DataTable
      ariaLabel="Clients"
      columns={columns}
      rows={CLIENTS}
      getRowId={(r) => r.id}
    />
  );
}
