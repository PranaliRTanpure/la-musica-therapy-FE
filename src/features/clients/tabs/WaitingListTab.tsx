import { DataTable } from '@/components/common/DataTable';
import type {
  DataTableColumn,
  DataTablePaginationProps,
} from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '@/components/common/NameLink';
import { WAITING_LIST } from '../data';
import type { WaitingListRow } from '../types';
import { patientChartPath } from '@/config/routes';

const columns: DataTableColumn<WaitingListRow>[] = [
  {
    id: 'name',
    label: 'Name',
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

interface WaitingListTabProps {
  /** Rows to display; defaults to the full waiting list. Parent passes the paged slice. */
  rows?: WaitingListRow[];
  /** Forwarded to DataTable so pagination renders inside the table card. */
  pagination?: DataTablePaginationProps;
}

export function WaitingListTab({
  rows = WAITING_LIST,
  pagination,
}: WaitingListTabProps) {
  return (
    <DataTable
      ariaLabel="Waiting List"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      pagination={pagination}
    />
  );
}
