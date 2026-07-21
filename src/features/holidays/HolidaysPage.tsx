import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { formatShortDate } from '@/utils/date';
import { HolidayActions } from './components/HolidayActions';
import { HolidayFormDialog } from './components/HolidayFormDialog';
import { HOLIDAYS } from './data';
import type { HolidayRow } from './types';

/** An absent description renders as an em dash rather than a blank cell. */
const describe = (description: string) => description || '—';

const columns: DataTableColumn<HolidayRow>[] = [
  {
    id: 'title',
    label: 'Holiday Title',
    // Plain text, not a link — holidays open from the row's action menu.
    render: (row) => (
      <Typography
        variant="body2"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightSemiBold })}
      >
        {row.title}
      </Typography>
    ),
  },
  { id: 'date', label: 'Date', render: (row) => formatShortDate(row.date) },
  {
    id: 'description',
    label: 'Description',
    render: (row) => describe(row.description),
  },
  {
    id: 'createdDate',
    label: 'Created Date',
    render: (row) => formatShortDate(row.createdDate),
  },
];

/**
 * Settings → Holidays: the clinic's non-working days. Static — Add and Edit are
 * presentational until the API and their forms land.
 */
export function HolidaysPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  // `null` = adding; a row = editing that row. One dialog serves both.
  const [editing, setEditing] = useState<HolidayRow | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (row: HolidayRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label="Back to settings"
            onClick={() => navigate(-1)}
            sx={{ flexShrink: 0 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="h1"
            sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
          >
            Holidays
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Holidays
        </Button>
      </Stack>

      <DataTable
        ariaLabel="Holidays"
        columns={columns}
        rows={HOLIDAYS}
        getRowId={(row) => row.id}
        selectable={false}
        renderRowActions={(row) => (
          <HolidayActions
            holidayTitle={row.title}
            onEdit={() => openEdit(row)}
          />
        )}
      />

      <HolidayFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        holiday={editing}
        // Static phase: the create/update mutation lands here.
        onSubmit={() => undefined}
      />
    </Box>
  );
}
