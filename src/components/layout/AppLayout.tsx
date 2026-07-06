import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ViewSidebarRounded from '@mui/icons-material/ViewSidebarRounded';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/ui-store';

/**
 * App shell: collapsible primary Sidebar + a slim header whose toggle drives the
 * collapse, with the routed page rendered in a scrollable content area.
 */
export function AppLayout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <Box
      sx={{
        display: 'flex',
        // Avoid raw 100vh on mobile (Safari URL-bar jump); prefer dvh where supported.
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
      }}
    >
      <Sidebar collapsed={!sidebarOpen} />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0,
            height: 56,
            px: 2,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tooltip title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <IconButton
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-pressed={!sidebarOpen}
            >
              <ViewSidebarRounded />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
