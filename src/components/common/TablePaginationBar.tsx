import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
}

/**
 * Shared table footer: rows-per-page, range summary, go-to-page, and page
 * buttons. Static (non-wired) for now — props describe what to display; the
 * controls are presentational until real pagination lands.
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
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <Select
            defaultValue={rowsPerPage}
            size="small"
            sx={{ '& .MuiSelect-select': { py: 0.5 } }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {fromRow}-{toRow} of {total}
        </Typography>
      </Stack>

      {/* Center: go to page */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
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
              fontSize: theme.typography.body1.fontSize,
              py: 0.5,
              textAlign: 'center',
            },
          })}
          slotProps={{ htmlInput: { 'aria-label': 'Go to page' } }}
        />
        <Button variant="outlined" size="small" onClick={submitGoTo}>
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
          color="primary"
          shape="rounded"
          siblingCount={1}
        />
      </Box>
    </Stack>
  );
}
