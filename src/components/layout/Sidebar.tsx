import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { NAV_ITEMS } from './nav-config';
import logoWordmark from '@/assets/logo-la-musica.png';
import logoMark from '@/assets/logo-la-musica-mark.png';

const EXPANDED_WIDTH = 200;
const COLLAPSED_WIDTH = 60;

/**
 * Navy rail with a lighter-blue right border + soft drop shadow, sticky
 * full-height column. Static styling lives here; the collapsed/expanded width
 * is applied via `sx` on the instance.
 */
const Root = styled('nav')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  height: '100%',
  backgroundColor: theme.palette.nav.bg,
  borderRight: `1px solid ${theme.palette.nav.border}`,
  boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeOut,
  }),
  overflow: 'hidden',
}));

// Logo band — bottom divider in the lighter nav border colour.
const LogoBand = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.nav.border}`,
}));

const NavList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flex: 1,
  minHeight: 0,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
}));

// Base nav-item styles; NavLink adds the `.active` class on the current route.
const NavItem = styled(NavLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  height: 44, // >= 44px tap target (Apple HIG)
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.nav.itemText,
  textDecoration: 'none',
  fontFamily: theme.typography.fontFamily,
  fontSize: 16, // >= 16px avoids iOS focus zoom & matches design
  fontWeight: 500,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  }),
  '& svg': { flexShrink: 0, fontSize: 24 },
  '&:hover': {
    backgroundColor: theme.palette.nav.itemHoverBg,
    textDecoration: 'none',
  },
  '&.active': {
    backgroundColor: theme.palette.nav.itemActiveBg,
    color: theme.palette.nav.itemActiveText,
  },
}));

export interface SidebarProps {
  /** Icon-only 60px rail when true; labelled 200px nav when false. */
  collapsed?: boolean;
}

/**
 * Sidebar — primary navigation rail (Figma "Side Nav Admin Provider").
 * Expands to a labelled 200px nav or collapses to a 60px icon-only rail.
 */
export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <Root
      aria-label="Primary"
      sx={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      <LogoBand sx={collapsed ? { px: '10px' } : undefined}>
        <Box
          component="img"
          src={collapsed ? logoMark : logoWordmark}
          alt="LA Musica Therapy"
          sx={{
            height: 32,
            width: collapsed ? 'auto' : 156,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </LogoBand>

      <NavList
        sx={{
          px: collapsed ? '10px' : 1,
          alignItems: collapsed ? 'center' : 'stretch',
        }}
      >
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavItem
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            aria-label={label}
            sx={
              collapsed
                ? { width: 44, justifyContent: 'center' }
                : { width: '100%' }
            }
          >
            <Icon aria-hidden="true" />
            {collapsed ? null : <span>{label}</span>}
          </NavItem>
        ))}
      </NavList>
    </Root>
  );
}
