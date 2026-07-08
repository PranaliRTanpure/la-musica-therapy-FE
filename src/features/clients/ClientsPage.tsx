import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { AppTabs } from '@/components/common/AppTabs';
import { TablePaginationBar } from '@/components/common/TablePaginationBar';
import { LeadsTab } from './tabs/LeadsTab';
import { ProspectsTab } from './tabs/ProspectsTab';
import { WaitingListTab } from './tabs/WaitingListTab';
import { ClientsTab } from './tabs/ClientsTab';
import { LEADS, PROSPECTS, WAITING_LIST, CLIENTS } from './data';

interface TabConfig {
  label: string;
  render: () => ReactNode;
  total: number;
  pageCount: number;
  action?: ReactNode;
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
    label: 'Leads',
    render: () => <LeadsTab />,
    total: LEADS.length,
    pageCount: pages(LEADS.length),
    action: (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add Leads
      </Button>
    ),
  },
  {
    label: 'Prospects',
    render: () => <ProspectsTab />,
    total: PROSPECTS.length,
    pageCount: pages(PROSPECTS.length),
  },
  {
    label: 'Waiting List',
    render: () => <WaitingListTab />,
    total: WAITING_LIST.length,
    pageCount: pages(WAITING_LIST.length),
  },
  {
    label: 'Clients',
    render: () => <ClientsTab />,
    total: CLIENTS.length,
    pageCount: pages(CLIENTS.length),
  },
];

export function ClientsPage() {
  const [tab, setTab] = useState(0);
  const active = TAB_CONFIG[tab];

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
          onChange={setTab}
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
            <IconButton
              aria-label="Filter"
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {active.action}
        </Stack>
      </Stack>

      {/* Active tab's table */}
      {active.render()}

      {/* Shared pagination footer */}
      <TablePaginationBar total={active.total} pageCount={active.pageCount} />
    </Box>
  );
}
