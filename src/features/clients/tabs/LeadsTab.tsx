import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { DataTable } from '@/components/common/DataTable';
import type {
  DataTableColumn,
  DataTablePaginationProps,
} from '@/components/common/DataTable';
import { StatusChip } from '@/components/common/StatusChip';
import { NameLink } from '@/components/common/NameLink';
import { RowActionsMenu } from '@/components/common/RowActionsMenu';
import { LEADS } from '../data';
import type { LeadRow } from '../types';
import { leadDetailPath } from '@/config/routes';

const columns: DataTableColumn<LeadRow>[] = [
  {
    id: 'name',
    label: 'Lead Name',
    render: (r) => <NameLink to={leadDetailPath(r.id)}>{r.name}</NameLink>,
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

interface LeadsTabProps {
  /** Rows to display; defaults to all leads. Parent passes filtered rows. */
  rows?: LeadRow[];
  /** Forwarded to DataTable so pagination renders inside the table card. */
  pagination?: DataTablePaginationProps;
}

export function LeadsTab({ rows = LEADS, pagination }: LeadsTabProps) {
  const navigate = useNavigate();
  const [resendToastOpen, setResendToastOpen] = useState(false);

  return (
    <>
      <DataTable
        ariaLabel="Leads"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        pagination={pagination}
        renderRowActions={(row) => (
          <RowActionsMenu
            label={row.name}
            actions={[
              {
                key: 'view',
                label: 'View',
                icon: <VisibilityOutlinedIcon fontSize="small" />,
                onClick: () => navigate(`${leadDetailPath(row.id)}?mode=view`),
              },
              {
                key: 'edit',
                label: 'Edit',
                icon: <EditOutlinedIcon fontSize="small" />,
                onClick: () => navigate(leadDetailPath(row.id)),
              },
              {
                key: 'resend-link',
                label: 'Resend link',
                icon: <SendOutlinedIcon fontSize="small" />,
                onClick: () => setResendToastOpen(true),
              },
            ]}
          />
        )}
      />

      <Snackbar
        open={resendToastOpen}
        autoHideDuration={3000}
        onClose={() => setResendToastOpen(false)}
        message="Link resent"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
