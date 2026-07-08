import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '../components/NameLink';
import { LEADS } from '../data';
import type { LeadRow } from '../types';

const columns: DataTableColumn<LeadRow>[] = [
  {
    id: 'name',
    label: 'Lead Name',
    render: (r) => <NameLink>{r.name}</NameLink>,
  },
  { id: 'phone', label: 'Phone Number', render: (r) => r.phone },
  { id: 'email', label: 'Email', render: (r) => r.email },
  { id: 'source', label: 'Source', render: (r) => r.source },
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
  {
    id: 'createdBy',
    label: 'Created By',
    render: (r) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ width: 24, height: 24 }}>
          <Typography variant="caption" component="span">
            {r.createdBy.charAt(0)}
          </Typography>
        </Avatar>
        <Typography variant="body2">{r.createdBy}</Typography>
      </Stack>
    ),
  },
  { id: 'createdOn', label: 'Created On', render: (r) => r.createdOn },
];

export function LeadsTab() {
  return (
    <DataTable
      ariaLabel="Leads"
      columns={columns}
      rows={LEADS}
      getRowId={(r) => r.id}
    />
  );
}
