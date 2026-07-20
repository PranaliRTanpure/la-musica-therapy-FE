import type { SxProps, Theme } from '@mui/material/styles';

/**
 * The single column template shared by the Working Hours header band and every
 * slot row, so the two can never drift out of alignment.
 *
 * Day and the two time fields take fixed-ish widths; Location absorbs what's
 * left (`minmax(0, 1fr)` — the `0` lets it shrink rather than overflow). Below
 * `md` the row stacks into two columns.
 *
 * Typed with `satisfies` rather than annotated: an `SxProps` annotation would
 * widen these to a union that includes arrays, which can't nest inside an
 * `sx={[...]}` array at the call site.
 */
export const WORKING_HOURS_GRID = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    md: 'minmax(8rem, 12rem) minmax(7rem, 9rem) minmax(7rem, 9rem) minmax(0, 1fr) auto',
  },
  columnGap: 1.5,
  rowGap: { xs: 1.5, md: 0 },
  alignItems: 'center',
  px: 2,
} satisfies SxProps<Theme>;

/** Cells that span the full width of the stacked mobile row. */
export const FULL_WIDTH_ON_MOBILE = {
  gridColumn: { xs: 'span 2', md: 'auto' },
} satisfies SxProps<Theme>;
