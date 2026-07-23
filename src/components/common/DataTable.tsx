import { useEffect, useRef, useState } from 'react';
import type { ReactNode, UIEvent } from 'react';
import type { Theme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TablePaginationBar } from './TablePaginationBar';

/** One column definition. `render` returns the cell content for a given row. */
export interface DataTableColumn<T> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
  /**
   * Pins this column so it stays in place while the rest of the table
   * scrolls horizontally. `'left'` pins after the checkbox column (if any);
   * `'right'` pins before the actions column (if any). Only meaningful when
   * the table is wider than its container.
   */
  sticky?: 'left' | 'right';
  /** Fixed width in px, required for sticky columns to compute offsets. */
  width?: number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Render a leading select-all / per-row checkbox column. */
  selectable?: boolean;
  /** Render a trailing actions column (defaults to a kebab menu button). */
  showActions?: boolean;
  /** Custom actions cell; falls back to a MoreVert IconButton. */
  renderRowActions?: (row: T) => ReactNode;
  /** Accessible label for the table. */
  ariaLabel?: string;
  /**
   * Controlled selection. When provided, the parent owns the selection and the
   * component holds no internal state; pair with `onSelectionChange`. Omit both
   * to use the component uncontrolled.
   */
  selectedIds?: readonly string[];
  /** Fired with the next selection whenever it changes (controlled or not). */
  onSelectionChange?: (ids: string[]) => void;
  /** Shown in place of the rows when `rows` is empty. Defaults to "No results". */
  emptyState?: ReactNode;
  /**
   * Renders a pagination footer under the table when provided.
   *
   * Uncontrolled: pass `rowsPerPage` (optional) and the table slices `rows`
   * itself and manages its own page state.
   *
   * Controlled: pass `page`, `pageCount`, and `onPageChange` — the parent
   * owns page state and is expected to have already sliced/fetched `rows`
   * for the current page (e.g. server-paginated data, or a shared footer
   * driving multiple tables).
   */
  pagination?: DataTablePaginationProps;
}

export interface DataTablePaginationProps {
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  /** Controlled current page (1-based). Omit to let the table manage its own. */
  page?: number;
  /** Controlled total page count. Omit (uncontrolled mode) to derive from `rows.length`. */
  pageCount?: number;
  /**
   * Controlled total row count across all pages. Required in controlled mode
   * since `rows` there is just the current page's slice; omit in uncontrolled
   * mode to derive from `rows.length`.
   */
  total?: number;
  /** Fired on page change. Required for controlled mode. */
  onPageChange?: (page: number) => void;
  /** Fired on rows-per-page change (controlled mode only). */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

/**
 * Shared table used by every Clients tab so all tables look and behave the
 * same. Wraps MUI's Table primitives (kept, per convention) and centralizes the
 * common styling — themed header, dividers, row hover, checkbox + actions
 * columns, and horizontal scroll on narrow screens. Column-specific look lives
 * in `theme.components.MuiTableCell`; this component owns structure + behavior.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = true,
  showActions = true,
  renderRowActions,
  ariaLabel,
  selectedIds,
  onSelectionChange,
  emptyState,
  pagination,
}: DataTableProps<T>) {
  const [internalSelected, setInternalSelected] = useState<readonly string[]>(
    []
  );
  // Controlled when the parent passes `selectedIds`; otherwise self-managed.
  const isControlled = selectedIds !== undefined;
  const selected = isControlled ? selectedIds : internalSelected;

  const emitSelection = (next: string[]) => {
    if (!isControlled) setInternalSelected(next);
    onSelectionChange?.(next);
  };

  // Pagination: controlled when the parent passes `page`/`onPageChange`,
  // otherwise the table slices `rows` and manages page state itself.
  const isPaginationControlled = pagination?.page !== undefined;
  const rowsPerPageDefault = pagination?.rowsPerPage ?? 10;
  const [internalPage, setInternalPage] = useState(1);
  const [internalRowsPerPage, setInternalRowsPerPage] =
    useState(rowsPerPageDefault);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sticky columns only need a divider shadow once the table has actually
  // scrolled under them; recompute on every scroll of the table container.
  const handleTableScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    setIsScrolledLeft(el.scrollLeft > 0);
    setIsScrolledRight(
      Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth
    );
  };

  const leftPinnedColumns = columns.filter((col) => col.sticky === 'left');
  const rightPinnedColumns = columns.filter((col) => col.sticky === 'right');

  // Detect initial horizontal overflow (table wider than container) so the
  // right-pinned divider shows up front, before the user scrolls at all.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsScrolledRight(
      Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth
    );
  }, [columns, rows.length]);

  const lastLeftPinnedId = leftPinnedColumns[leftPinnedColumns.length - 1]?.id;

  const firstRightPinnedId = rightPinnedColumns[0]?.id;

  const currentPage = isPaginationControlled
    ? (pagination.page as number)
    : internalPage;
  const currentRowsPerPage = isPaginationControlled
    ? rowsPerPageDefault
    : internalRowsPerPage;

  const totalRowCount = pagination?.total ?? rows.length;
  const computedPageCount = Math.max(
    1,
    Math.ceil(totalRowCount / currentRowsPerPage)
  );
  const currentPageCount = pagination?.pageCount ?? computedPageCount;

  const displayedRows =
    pagination && !isPaginationControlled
      ? rows.slice(
          (currentPage - 1) * currentRowsPerPage,
          currentPage * currentRowsPerPage
        )
      : rows;

  const handlePageChange = (next: number) => {
    if (!isPaginationControlled) setInternalPage(next);
    pagination?.onPageChange?.(next);
  };

  const handleRowsPerPageChange = (next: number) => {
    if (!isPaginationControlled) {
      setInternalRowsPerPage(next);
      setInternalPage(1);
    }
    pagination?.onRowsPerPageChange?.(next);
  };

  const rowCount = displayedRows.length;
  const numSelected = selected.filter((id) =>
    displayedRows.some((row) => getRowId(row) === id)
  ).length;
  const allSelected = rowCount > 0 && numSelected === rowCount;
  const someSelected = numSelected > 0 && numSelected < rowCount;

  const toggleAll = () => {
    const pageIds = displayedRows.map(getRowId);
    emitSelection(
      allSelected
        ? selected.filter((id) => !pageIds.includes(id))
        : [...selected.filter((id) => !pageIds.includes(id)), ...pageIds]
    );
  };

  const toggleRow = (id: string) =>
    emitSelection(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );

  // Columns + optional checkbox + optional actions column, for the empty-state
  // cell's colSpan so it stretches across the full table width.
  const colSpan = columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0);

  // Left offsets for left-sticky columns stack after the checkbox column;
  // right offsets for right-sticky columns stack before the actions column.
  const checkboxWidth = 48;
  const actionsWidth = 64;
  let leftOffset = selectable ? checkboxWidth : 0;
  const leftStickyOffsets = new Map<string, number>();
  columns.forEach((col) => {
    if (col.sticky === 'left') {
      leftStickyOffsets.set(col.id, leftOffset);
      leftOffset += col.width ?? 150;
    }
  });
  let rightOffset = showActions ? actionsWidth : 0;
  const rightStickyOffsets = new Map<string, number>();
  [...columns].reverse().forEach((col) => {
    if (col.sticky === 'right') {
      rightStickyOffsets.set(col.id, rightOffset);
      rightOffset += col.width ?? 150;
    }
  });

  const stickyCellSx = (col: DataTableColumn<T>) => {
    if (!col.sticky) {
      return {
        width: col.width,
        minWidth: col.width,
      };
    }

    const isLastLeftPinned = col.id === lastLeftPinnedId;
    const isFirstRightPinned = col.id === firstRightPinnedId;

    return {
      position: 'sticky' as const,

      [col.sticky]:
        col.sticky === 'left'
          ? leftStickyOffsets.get(col.id)
          : rightStickyOffsets.get(col.id),

      zIndex: 2,
      bgcolor: 'background.paper',
      width: col.width,
      minWidth: col.width,

      transition: 'box-shadow .2s ease',

      ...(isLastLeftPinned &&
        isScrolledLeft && {
          boxShadow: (theme: Theme) =>
            `4px 0 8px ${theme.palette.stickyShadow.color}`,
        }),

      ...(isFirstRightPinned &&
        isScrolledRight && {
          boxShadow: (theme: Theme) =>
            `-4px 0 8px ${theme.palette.stickyShadow.color}`,
        }),
    };
  };

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer
        ref={scrollContainerRef}
        onScroll={handleTableScroll}
        sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        <Table aria-label={ariaLabel} sx={{ minWidth: 'max-content' }}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Checkbox
                    color="primary"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    slotProps={{ input: { 'aria-label': 'Select all rows' } }}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={stickyCellSx(col)}
                >
                  {col.label}
                </TableCell>
              ))}
              {showActions && (
                <TableCell
                  align="right"
                  sx={{
                    position: 'sticky',
                    right: 0,
                    zIndex: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  align="center"
                  sx={{ py: 6, color: 'text.secondary', border: 0 }}
                >
                  {emptyState ?? 'No results'}
                </TableCell>
              </TableRow>
            )}
            {displayedRows.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              return (
                <TableRow
                  key={id}
                  hover
                  selected={isSelected}
                  sx={{ '&:last-of-type td': { border: 0 } }}
                >
                  {selectable && (
                    <TableCell
                      padding="checkbox"
                      sx={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        bgcolor: isSelected
                          ? 'action.selected'
                          : 'background.paper',
                      }}
                    >
                      <Checkbox
                        color="primary"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        slotProps={{
                          input: { 'aria-label': `Select row ${id}` },
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const isLastLeftPinned = col.id === lastLeftPinnedId;
                    const isFirstRightPinned = col.id === firstRightPinnedId;
                    return (
                      <TableCell
                        key={col.id}
                        align={col.align}
                        sx={{
                          ...stickyCellSx(col),
                          ...(col.sticky && {
                            bgcolor: isSelected
                              ? 'action.selected'
                              : 'background.paper',
                            zIndex: 2,
                            // Left pinned column → shadow on right
                            ...(col.sticky === 'left' &&
                              isLastLeftPinned &&
                              isScrolledLeft &&
                              !isSelected && {
                                boxShadow: (theme: Theme) =>
                                  `4px 0 8px ${theme.palette.stickyShadow.color}`,
                                zIndex: 3,
                              }),

                            // Right pinned column → shadow on left
                            ...(col.sticky === 'right' &&
                              isFirstRightPinned &&
                              isScrolledRight &&
                              !isSelected && {
                                boxShadow: (theme: Theme) =>
                                  `-4px 0 8px ${theme.palette.stickyShadow.color}`,
                                zIndex: 3,
                              }),
                          }),
                        }}
                      >
                        {col.render(row)}
                      </TableCell>
                    );
                  })}

                  {showActions && (
                    <TableCell
                      align="right"
                      sx={{
                        position: 'sticky',
                        right: 0,
                        zIndex: 1,
                        bgcolor: isSelected
                          ? 'action.selected'
                          : 'background.paper',
                      }}
                    >
                      {renderRowActions ? (
                        renderRowActions(row)
                      ) : (
                        <IconButton
                          size="small"
                          aria-label={`Row actions for ${id}`}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePaginationBar
          total={pagination.total ?? rows.length}
          rowsPerPage={currentRowsPerPage}
          rowsPerPageOptions={pagination.rowsPerPageOptions}
          page={currentPage}
          pageCount={currentPageCount}
          fromRow={
            totalRowCount === 0 ? 0 : (currentPage - 1) * currentRowsPerPage + 1
          }
          toRow={Math.min(currentPage * currentRowsPerPage, totalRowCount)}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Paper>
  );
}
