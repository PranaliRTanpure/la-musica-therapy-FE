import type * as React from 'react';
import { createTheme } from '@mui/material/styles';

/**
 * Extra palette slots owned by this app (not part of MUI's defaults). Declared
 * here so `theme.palette.nav.*` is type-safe everywhere.
 */
declare module '@mui/material/styles' {
  interface Palette {
    nav: {
      bg: string;
      border: string;
      itemText: string;
      itemHoverBg: string;
      itemActiveBg: string;
      itemActiveText: string;
    };
    border: {
      hover: string;
    };
    placeholder: {
      main: string;
    };
  }
  interface PaletteOptions {
    nav?: Palette['nav'];
    border?: Palette['border'];
    placeholder?: Palette['placeholder'];
  }
}

// The design's "semibold" weight (between MUI's medium 500 and bold 700), used
// for field labels, section titles, etc. Reference via
// `theme.typography.fontWeightSemiBold` instead of hardcoding 600.
//
// `FontStyle` is declared in `createTypography`, so it must be augmented there:
// augmenting the `@mui/material/styles` re-export declares a *separate*
// interface that `theme.typography` never picks up.
declare module '@mui/material/styles/createTypography' {
  interface FontStyle {
    fontWeightSemiBold: number;
  }
  interface TypographyVariants {
    authPageTitle: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    authPageSubtitle: React.CSSProperties;
    captchaChar: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    authPageTitle?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    authPageSubtitle?: React.CSSProperties;
    captchaChar?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    authPageTitle: true;
    bodyMedium: true;
    authPageSubtitle: true;
    captchaChar: true;
  }
}

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH for all design tokens.
 * ============================================================================
 * Fill the values below from the designers' repo/design. Once set, ALL screens
 * consume these via the theme — never hardcode colors, spacing, or radii in
 * components. Use theme values through `sx`, `styled`, or MUI props instead.
 *
 * How to pull values from the designers' site:
 *   - Colors:      DevTools → inspect element → Computed → color / background
 *   - Font sizes:  Computed → font-size, font-weight, line-height
 *   - Spacing:     measure paddings/margins; find the common base unit (often 8px)
 *   - Radii:       Computed → border-radius
 * ============================================================================
 */

// --- 1. PALETTE (replace hex values with the design's actual colors) ---
const palette = {
  primary: {
    main: '#357cf7', // --color-primary  (--brand-7)
    dark: '#2c6bdb', // --color-primary-hover (--brand-8)
    light: '#8db9ff', // --color-primary-subtle (--brand-4)
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#7C3AED', // TODO
    light: '#A78BFA',
    dark: '#5B21B6',
    contrastText: '#FFFFFF',
  },
  error: { main: '#DC2626' },
  warning: { main: '#D97706' },
  success: { main: '#16A34A' },
  info: { main: '#0891B2' },
  background: {
    default: '#F9FAFB', // page background
    paper: '#FFFFFF', // cards, surfaces
  },
  action: {
    hover: '#F3F3F8', // input hover background
  },
  border: {
    hover: '#D1D1D6', // input border color on hover
  },
  placeholder: {
    main: '#A1A1A6', // input placeholder text color
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  divider: '#E5E7EB',
  // Side navigation rail (Figma "Side Nav Admin Provider") — navy rail with a
  // lighter-blue right border; active item is a white pill with navy text.
  nav: {
    bg: '#123471',
    border: '#2E4C86',
    itemText: '#FFFFFF',
    itemHoverBg: 'rgba(255, 255, 255, 0.10)',
    itemActiveBg: '#FFFFFF',
    itemActiveText: '#123471',
  },
};

// --- 2. TYPOGRAPHY (match the design's font family + scale) ---
const typography = {
  // TODO: set the design's font. If it's a Google Font, also import it in index.html or index.css.
  fontFamily: [
    'Inter',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ].join(','),
  fontWeightSemiBold: 600,
  h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.25 },
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
  body1: { fontSize: '1rem', lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  authPageTitle: { fontSize: '1.625rem', fontWeight: 600, lineHeight: 1.3 },
  bodyMedium: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
  authPageSubtitle: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  captchaChar: { fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.3 },
  button: { textTransform: 'none' as const, fontWeight: 600 }, // MUI uppercases by default; usually you don't want that
};

// --- 3. SHAPE (border radius) ---
const shape = {
  borderRadius: 8, // TODO: match design's default radius
};

// Reusable content-width constants for form/card layouts (px).
export const layout = {
  authFormMaxWidth: 420,
};

/**
 * --- 4. COMPONENT DEFAULT OVERRIDES ---
 * Set defaults here ONCE so every instance is consistent and freshers don't
 * re-style per screen. Example: default button size, disable elevation, etc.
 */
export const theme = createTheme({
  palette,
  typography,
  shape,
  spacing: 8, // 1 spacing unit = 8px. Use theme.spacing(2) => 16px, or sx={{ p: 2 }}
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          // Must stay >= 16px: iOS Safari auto-zooms the viewport on focus
          // for any input with a smaller font-size.
          fontSize: '1rem', // 16px
          '&::placeholder': {
            fontSize: '0.875rem', // 14px (never focusable itself, safe below 16px)
            color: palette.placeholder.main,
            opacity: 1,
          },
        },
      },
    },
    // Focused state across all inputs uses the lighter brand blue
    // (--brand-4) rather than the darker primary.main.
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover:not(.Mui-focused):not(.Mui-disabled)': {
            backgroundColor: palette.action.hover,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.border.hover,
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.light,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: palette.primary.light },
        },
      },
    },
    // Default focus-visible ring (buttons, checkboxes, tabs, etc.) uses the
    // same lighter brand blue instead of the browser default / primary.main.
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `2px solid ${palette.primary.light}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `1px solid ${palette.divider}` },
      },
    },
    // --- Shared table styling (single source of truth for ALL tables) ---
    // Every table rendered via the common DataTable inherits this look, so the
    // Leads / Prospects / Waiting List / Clients tables stay identical.
    MuiTableContainer: {
      styleOverrides: {
        root: { borderRadius: shape.borderRadius },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: palette.divider,
          whiteSpace: 'nowrap',
          fontSize: typography.body2.fontSize,
          // Tighter vertical padding than MUI's default so table rows are more
          // compact; horizontal padding stays at the default 16px so columns
          // keep breathing room. (Row height floors ~43px on the checkbox/
          // action controls, so 4px is near the practical minimum.)
          paddingTop: 4,
          paddingBottom: 4,
        },
        head: {
          backgroundColor: palette.background.default,
          color: palette.text.secondary,
          fontWeight: 600,
        },
        body: {
          color: palette.text.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        // Slightly softer hover than MUI's default for long, dense rows.
        hover: {
          '&:hover': { backgroundColor: palette.background.default },
        },
      },
    },
  },
});

export default theme;
