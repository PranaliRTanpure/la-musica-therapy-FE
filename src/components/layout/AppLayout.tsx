import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
// import ViewSidebarRounded from '@mui/icons-material/ViewSidebarRounded';
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/ui-store';

/**
 * App shell. Desktop (>= md): a persistent collapsible Sidebar rail. Mobile
 * (< md): the Sidebar lives in a temporary Drawer opened from the header
 * toggle and dismissed on backdrop tap or nav selection. A slim header holds
 * the toggle; the routed page renders in a scrollable content area.
 */
export function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const openMobileNav = useUIStore((s) => s.openMobileNav);
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);

  const toggleTitle = isMobile
    ? 'Open menu'
    : sidebarOpen
      ? 'Collapse sidebar'
      : 'Expand sidebar';

  return (
    <Box
      sx={{
        display: 'flex',
        // Avoid raw 100vh on mobile (Safari URL-bar jump); prefer dvh where supported.
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
      }}
    >
      {/* Desktop: persistent collapsible rail */}
      {!isMobile && <Sidebar collapsed={!sidebarOpen} />}

      {/* Mobile: temporary drawer (backdrop, ESC, focus-trap handled by MUI) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileNavOpen}
          onClose={closeMobileNav}
          ModalProps={{ keepMounted: true }}
          slotProps={{ paper: { sx: { border: 'none' } } }}
        >
          <Sidebar onNavigate={closeMobileNav} />
        </Drawer>
      )}

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
          <Tooltip title={toggleTitle}>
            <IconButton
              onClick={isMobile ? openMobileNav : toggleSidebar}
              aria-label={isMobile ? 'Open navigation menu' : 'Toggle sidebar'}
              aria-expanded={isMobile ? mobileNavOpen : undefined}
              aria-pressed={isMobile ? undefined : !sidebarOpen}
            >
              <ViewHeadlineOutlinedIcon />
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
