import { useState } from 'react';
import type { ReactNode } from 'react';
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

/** One column definition. `render` returns the cell content for a given row. */
export interface DataTableColumn<T> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => ReactNode;
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

  const rowCount = rows.length;
  const numSelected = selected.length;
  const allSelected = rowCount > 0 && numSelected === rowCount;
  const someSelected = numSelected > 0 && numSelected < rowCount;

  const toggleAll = () => emitSelection(allSelected ? [] : rows.map(getRowId));

  const toggleRow = (id: string) =>
    emitSelection(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );

  // Columns + optional checkbox + optional actions column, for the empty-state
  // cell's colSpan so it stretches across the full table width.
  const colSpan = columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0);

  return (
    <TableContainer component={Paper}>
      <Table aria-label={ariaLabel} sx={{ minWidth: 'max-content' }}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell padding="checkbox">
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
              <TableCell key={col.id} align={col.align}>
                {col.label}
              </TableCell>
            ))}
            {showActions && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 && (
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
          {rows.map((row) => {
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
                  <TableCell padding="checkbox">
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
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align}>
                    {col.render(row)}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell align="right">
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
  );
}
