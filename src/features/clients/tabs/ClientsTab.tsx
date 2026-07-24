import { DataTable } from '@/components/common/DataTable';
import type {
  DataTableColumn,
  DataTablePaginationProps,
} from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '@/components/common/NameLink';
import { CLIENTS } from '../data';
import type { ClientRow } from '../types';
import { patientChartPath } from '@/config/routes';

const columns: DataTableColumn<ClientRow>[] = [
  {
    id: 'name',
    label: 'Client Name',
    sticky: 'left',
    width: 200,
    render: (r) => <NameLink to={patientChartPath(r.id)}>{r.name}</NameLink>,
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

interface ClientsTabProps {
  /** Rows to display; defaults to all clients. Parent passes the paged slice. */
  rows?: ClientRow[];
  /** Forwarded to DataTable so pagination renders inside the table card. */
  pagination?: DataTablePaginationProps;
}

export function ClientsTab({ rows = CLIENTS, pagination }: ClientsTabProps) {
  return (
    <DataTable
      ariaLabel="Clients"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      pagination={pagination}
    />
  );
}
