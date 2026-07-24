import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { paginationFontSize } from '@/theme/theme';

export interface TablePaginationBarProps {
  /** Rows shown per page (static for now). */
  rowsPerPage?: number;
  /** Options offered in the rows-per-page select. */
  rowsPerPageOptions?: number[];
  /** Total number of records across all pages. */
  total: number;
  /** 1-based index of the first row on the current page. */
  fromRow?: number;
  /** 1-based index of the last row on the current page. */
  toRow?: number;
  /** Current page (1-based). */
  page?: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with a valid target page when the user submits "Go to page". */
  onGoToPage?: (page: number) => void;
  /** Called when the user picks a new page via the page buttons. */
  onPageChange?: (page: number) => void;
  /** Called when the user changes rows-per-page. */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

/**
 * Shared table footer: rows-per-page, range summary, go-to-page, and page
 * buttons.
 */
export function TablePaginationBar({
  rowsPerPage = 10,
  rowsPerPageOptions = [10, 25, 50],
  total,
  fromRow = 1,
  toRow = Math.min(rowsPerPage, total),
  page = 1,
  pageCount,
  onGoToPage,
  onPageChange,
  onRowsPerPageChange,
}: TablePaginationBarProps) {
  // Local edit buffer so the user can type freely before committing. Kept in
  // sync with the `page` prop so it reflects external page changes (e.g. after
  // a data load) once real pagination is wired.
  const [pageInput, setPageInput] = useState(String(page));
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const submitGoTo = () => {
    const next = Number(pageInput);
    if (Number.isInteger(next) && next >= 1 && next <= pageCount) {
      onGoToPage?.(next);
    }
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ px: { xs: 1, md: 2 }, py: 2 }}
    >
      {/* Left: rows per page + range */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: paginationFontSize, fontWeight: 400 }}
          >
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            size="small"
            sx={{
              '& .MuiSelect-select': {
                py: 0.5,
                fontSize: paginationFontSize,
                fontWeight: 400,
              },
            }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem
                key={opt}
                value={opt}
                sx={{ fontSize: paginationFontSize }}
              >
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: paginationFontSize }}
        >
          {fromRow}-{toRow} of {total}
        </Typography>
      </Stack>

      {/* Center: go to page */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: paginationFontSize }}
        >
          Go to page
        </Typography>
        <TextField
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitGoTo();
          }}
          size="small"
          fullWidth={false}
          sx={(theme) => ({
            width: theme.spacing(8),
            '& .MuiInputBase-input': {
              py: 0.5,
              textAlign: 'center',
              // Font-size stays at the theme default (16px) so iOS Safari
              // never sees a sub-16px input and auto-zooms the viewport on
              // focus. The smaller visual size to match the rest of the
              // pagination bar is achieved with a scale transform instead,
              // which doesn't affect the effective font-size iOS reads.
              // `paginationFontSize` is a rem value (e.g. "0.75rem"); since
              // 1rem is the base font-size, its numeric value IS the scale
              // factor relative to the input's 16px/1rem font-size.
              transform: `scale(${Number.parseFloat(paginationFontSize)})`,
              transformOrigin: 'center',
            },
          })}
          slotProps={{ htmlInput: { 'aria-label': 'Go to page' } }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={submitGoTo}
          sx={{
            color: 'text.secondary',
            borderColor: 'divider',
            fontSize: paginationFontSize,
            fontWeight: 400,
          }}
        >
          Go
        </Button>
      </Stack>

      {/* Right: page buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
        }}
      >
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_e, next) => onPageChange?.(next)}
          color="primary"
          shape="rounded"
          siblingCount={1}
          sx={{
            '& .MuiPaginationItem-root': {
              position: 'relative',
              fontSize: paginationFontSize,
              // Visual box stays a compact 22x22px pill, matching the design.
              width: 22,
              height: 22,
              minWidth: 22,
              padding: 0,
              // An invisible pseudo-element expands the tappable area to the
              // 44x44px Apple HIG minimum without inflating the visible pill,
              // so page numbers stay reliably tappable on touch devices.
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -11,
              },
            },
          }}
        />
      </Box>
    </Stack>
  );
}
