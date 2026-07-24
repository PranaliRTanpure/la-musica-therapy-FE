import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { AppButton } from '@/components/common/AppButton';
import { AppTextField } from '@/components/common/AppTextField';
import { AppTabs } from '@/components/common/AppTabs';
import type { DataTablePaginationProps } from '@/components/common/DataTable';
import { FilterMenu } from '@/components/common/FilterMenu';
import type {
  FilterGroup,
  FilterSelection,
} from '@/components/common/FilterMenu';
import { LeadsTab } from './tabs/LeadsTab';
import { ProspectsTab } from './tabs/ProspectsTab';
import { WaitingListTab } from './tabs/WaitingListTab';
import { ClientsTab } from './tabs/ClientsTab';
import { LEADS, PROSPECTS, WAITING_LIST, CLIENTS } from './data';
import { ROUTES } from '@/config/routes';
// Single source of truth for lead sources, shared with the Add Lead form so the
// filter options and the form dropdown can never drift apart.
import { SOURCE_OPTIONS, STATUS_OPTIONS } from '@/features/leads/schema';

const LEADS_FILTERS: FilterGroup[] = [
  { key: 'source', label: 'Source', options: SOURCE_OPTIONS },
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
];

interface TabConfig {
  /** Stable identity used by logic (don't branch on tab position/label text). */
  id: string;
  label: string;
  /** Total row count for this tab, with any filters already applied. */
  getTotal: (filters: FilterSelection) => number;
  /** Renders the tab's table, already sliced to the given page. */
  render: (
    page: number,
    rowsPerPage: number,
    filters: FilterSelection,
    pagination: DataTablePaginationProps
  ) => ReactNode;
  action?: ReactNode;
  /** Filter groups shown in the toolbar filter popover for this tab. */
  filterGroups?: FilterGroup[];
}

const DEFAULT_ROWS_PER_PAGE = 10;

const slice = <T,>(rows: T[], page: number, rowsPerPage: number) =>
  rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

const filterLeads = (filters: FilterSelection) => {
  const sourceFilter = filters.source ?? [];
  const statusFilter = filters.status ?? [];
  return LEADS.filter((row) => {
    const matchesSource =
      sourceFilter.length === 0 || sourceFilter.includes(row.source);
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(row.status.label);
    return matchesSource && matchesStatus;
  });
};

const TAB_CONFIG: TabConfig[] = [
  {
    id: 'leads',
    label: 'Leads',
    getTotal: (filters) => filterLeads(filters).length,
    render: (page, rowsPerPage, filters, pagination) => (
      <LeadsTab
        rows={slice(filterLeads(filters), page, rowsPerPage)}
        pagination={pagination}
      />
    ),
    filterGroups: LEADS_FILTERS,
    action: (
      <AppButton
        component={RouterLink}
        to={ROUTES.LEADS_NEW}
        variant="contained"
        startIcon={<AddIcon />}
        sx={(theme) => ({
          whiteSpace: 'nowrap',
          fontSize: theme.typography.actionSmall.fontSize,
          fontWeight: theme.typography.actionSmall.fontWeight,
        })}
      >
        Add Leads
      </AppButton>
    ),
  },
  {
    id: 'prospects',
    label: 'Prospects',
    getTotal: () => PROSPECTS.length,
    render: (page, rowsPerPage, _filters, pagination) => (
      <ProspectsTab
        rows={slice(PROSPECTS, page, rowsPerPage)}
        pagination={pagination}
      />
    ),
  },
  {
    id: 'waitingList',
    label: 'Waiting List',
    getTotal: () => WAITING_LIST.length,
    render: (page, rowsPerPage, _filters, pagination) => (
      <WaitingListTab
        rows={slice(WAITING_LIST, page, rowsPerPage)}
        pagination={pagination}
      />
    ),
  },
  {
    id: 'clients',
    label: 'Clients',
    getTotal: () => CLIENTS.length,
    render: (page, rowsPerPage, _filters, pagination) => (
      <ClientsTab
        rows={slice(CLIENTS, page, rowsPerPage)}
        pagination={pagination}
      />
    ),
  },
];

export function ClientsPage() {
  const [tab, setTab] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<FilterSelection>({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const active = TAB_CONFIG[tab];

  const filterGroups = active.filterGroups ?? [];
  const hasFilters = filterGroups.length > 0;

  // Switch tabs and reset paging/filters that don't apply to the new tab, so
  // stale state (e.g. page 3, or a Leads source filter) can't silently carry
  // over to a tab it doesn't belong to.
  const handleTabChange = (next: number) => {
    setTab(next);
    setFilterAnchor(null);
    setPage(1);
    if (!TAB_CONFIG[next].filterGroups?.length) {
      setFilters({});
    }
  };

  const total = useMemo(() => active.getTotal(filters), [active, filters]);
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  // Clamp so switching to a smaller-rowsPerPage or smaller-dataset tab can't
  // leave `page` pointing past the last available page.
  const currentPage = Math.min(page, pageCount);

  const handlePageChange = (next: number) => setPage(next);
  const handleRowsPerPageChange = (next: number) => {
    setRowsPerPage(next);
    setPage(1);
  };

  const pagination: DataTablePaginationProps = {
    total,
    page: currentPage,
    pageCount,
    rowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onGoToPage: handlePageChange,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 2 } }}>
      {/* Tabs + toolbar */}
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={2}
        sx={{ mb: { xs: 2, md: 2 } }}
      >
        <AppTabs
          ariaLabel="Client categories"
          value={tab}
          onChange={handleTabChange}
          items={TAB_CONFIG.map((t) => ({ label: t.label }))}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ flexShrink: 0 }}
        >
          <AppTextField
            placeholder="Search by..."
            size="small"
            showSearchIcon
            sx={{ width: '100%', maxWidth: { sm: 260 } }}
          />
          <Tooltip title="Filter">
            <span>
              <IconButton
                aria-label="Filter"
                disabled={!hasFilters}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <FilterAltOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {active.action}
        </Stack>
      </Stack>

      {/* Active tab's table (pagination renders inside its DataTable card) */}
      {active.render(currentPage, rowsPerPage, filters, pagination)}

      {/* Toolbar filter popover (Source filter for the Leads list) */}
      <FilterMenu
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        groups={filterGroups}
        selected={filters}
        onChange={setFilters}
      />
    </Box>
  );
}
