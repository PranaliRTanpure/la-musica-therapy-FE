import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { AppSelect } from '@/components/common/AppSelect';
import { DataTable } from '@/components/common/DataTable';
import type { DataTableColumn } from '@/components/common/DataTable';
import { NameLink } from '@/components/common/NameLink';
import { TablePaginationBar } from '@/components/common/TablePaginationBar';
import { availabilityDetailPath } from '@/config/routes';
import { formatShortDate } from '@/utils/date';
import { AVAILABILITY_ROWS, PROVIDER_OPTIONS } from './data';
import type { AvailabilityRow } from './types';

/** The design renders day counts two-digit: 5 → "05", 0 → "00". */
const padDays = (days: number) => days.toString().padStart(2, '0');

const columns: DataTableColumn<AvailabilityRow>[] = [
  {
    id: 'name',
    label: 'Name',
    render: (row) => (
      <NameLink to={availabilityDetailPath(row.id)}>{row.name}</NameLink>
    ),
  },
  {
    id: 'availableDays',
    label: 'Available Days',
    render: (row) => padDays(row.availableDays),
  },
  {
    id: 'blockDays',
    label: 'Block Days',
    render: (row) => padDays(row.blockDays),
  },
  {
    id: 'lastUpdatedOn',
    label: 'Last Updated On',
    render: (row) => formatShortDate(row.lastUpdatedOn),
  },
  { id: 'updatedBy', label: 'Updated By', render: (row) => row.updatedBy },
];

/**
 * Settings → Availability: every provider's bookable/blocked day counts.
 * Static — search and the provider filter are presentational until the API
 * lands, matching the other tables in this app.
 */
export function AvailabilityPage() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState('all');

  const rows = AVAILABILITY_ROWS;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
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
            Availability
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ sm: 'center' }}
        >
          <TextField
            placeholder="Search..."
            size="small"
            sx={(theme) => ({
              width: { xs: '100%', sm: '15rem' },
              bgcolor: 'background.paper',
              // >= 16px keeps iOS Safari from zooming on focus.
              '& .MuiInputBase-input': {
                fontSize: theme.typography.body1.fontSize,
              },
            })}
            slotProps={{
              htmlInput: { 'aria-label': 'Search providers' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <AppSelect
            options={PROVIDER_OPTIONS}
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            sx={{ width: { xs: '100%', sm: '12rem' }, flexShrink: 0 }}
            slotProps={{ htmlInput: { 'aria-label': 'Filter by provider' } }}
          />
        </Stack>
      </Stack>

      <DataTable
        ariaLabel="Provider availability"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable={false}
        showActions={false}
      />

      <TablePaginationBar
        rowsPerPage={25}
        total={rows.length}
        fromRow={1}
        toRow={rows.length}
        page={1}
        pageCount={1}
      />
    </Box>
  );
}
