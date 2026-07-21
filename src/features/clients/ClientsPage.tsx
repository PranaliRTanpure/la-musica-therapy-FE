import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { AppTabs } from '@/components/common/AppTabs';
import { TablePaginationBar } from '@/components/common/TablePaginationBar';
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
import { SOURCE_OPTIONS } from '@/features/leads/schema';

const LEADS_FILTERS: FilterGroup[] = [
  { key: 'source', label: 'Source', options: SOURCE_OPTIONS },
];

interface TabConfig {
  /** Stable identity used by logic (don't branch on tab position/label text). */
  id: string;
  label: string;
  render: () => ReactNode;
  total: number;
  pageCount: number;
  action?: ReactNode;
  /** Filter groups shown in the toolbar filter popover for this tab. */
  filterGroups?: FilterGroup[];
}

/**
 * Static phase: `total` / `pageCount` are derived from the mock row counts so
 * the footer can never drift out of sync with the data actually on screen. When
 * the API is wired, these come from the paginated response meta (server total +
 * page count) instead of the local arrays.
 */
const PAGE_SIZE = 10;
const pages = (count: number) => Math.max(1, Math.ceil(count / PAGE_SIZE));

const TAB_CONFIG: TabConfig[] = [
  {
    id: 'leads',
    label: 'Leads',
    render: () => <LeadsTab />,
    total: LEADS.length,
    pageCount: pages(LEADS.length),
    filterGroups: LEADS_FILTERS,
    action: (
      <Button
        component={RouterLink}
        to={ROUTES.LEADS_NEW}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add Leads
      </Button>
    ),
  },
  {
    id: 'prospects',
    label: 'Prospects',
    render: () => <ProspectsTab />,
    total: PROSPECTS.length,
    pageCount: pages(PROSPECTS.length),
  },
  {
    id: 'waitingList',
    label: 'Waiting List',
    render: () => <WaitingListTab />,
    total: WAITING_LIST.length,
    pageCount: pages(WAITING_LIST.length),
  },
  {
    id: 'clients',
    label: 'Clients',
    render: () => <ClientsTab />,
    total: CLIENTS.length,
    pageCount: pages(CLIENTS.length),
  },
];

export function ClientsPage() {
  const [tab, setTab] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<FilterSelection>({});
  const active = TAB_CONFIG[tab];

  const filterGroups = active.filterGroups ?? [];
  const hasFilters = filterGroups.length > 0;

  // Switch tabs and drop any active filter that doesn't apply to the new tab,
  // so a Leads source filter can't silently re-apply after navigating away.
  const handleTabChange = (next: number) => {
    setTab(next);
    setFilterAnchor(null);
    if (!TAB_CONFIG[next].filterGroups?.length) {
      setFilters({});
    }
  };

  // Apply the Source filter to the Leads list (static, client-side for now).
  const isLeads = active.id === 'leads';
  const sourceFilter = filters.source ?? [];
  const leadsRows =
    sourceFilter.length > 0
      ? LEADS.filter((row) => sourceFilter.includes(row.source))
      : LEADS;
  const total = isLeads ? leadsRows.length : active.total;
  const pageCount = isLeads ? pages(leadsRows.length) : active.pageCount;

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
          <TextField
            placeholder="Search by..."
            size="small"
            sx={(theme) => ({
              width: '100%',
              maxWidth: { sm: 260 },
              '& .MuiInputBase-input': {
                fontSize: theme.typography.body1.fontSize,
              },
            })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Tooltip title="Filter">
            <span>
              <IconButton
                aria-label="Filter"
                disabled={!hasFilters}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <FilterAltOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {active.action}
        </Stack>
      </Stack>

      {/* Active tab's table */}
      {isLeads ? <LeadsTab rows={leadsRows} /> : active.render()}

      {/* Shared pagination footer */}
      <TablePaginationBar total={total} pageCount={pageCount} />

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
