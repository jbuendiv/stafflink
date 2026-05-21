import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { tokens } from '@/app/providers/styles/theme';
import { Pagination } from './Pagination';

// ─── Column definition ────────────────────────────────────────────────────────

export interface Column<T> {
  /** Unique key for the column */
  key: string;
  /** Text shown in the `<th>` */
  label: string;
  /** Custom cell renderer. If omitted, renders `row[key]` as a string. */
  render?: (row: T) => React.ReactNode;
  /** Optional width / minWidth */
  width?: string | number;
  /** Alignment of the cell content */
  align?: 'left' | 'center' | 'right';
}

// ─── Pagination props (optional) ─────────────────────────────────────────────

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ─── DataTable props ──────────────────────────────────────────────────────────

interface DataTableProps<T extends object> {
  /** Column definitions */
  columns: Column<T>[];
  /** Rows to render */
  rows: T[];
  /** Callback when a row is clicked (makes rows interactive) */
  onRowClick?: (row: T) => void;
  /** Accessible label for the table */
  ariaLabel?: string;
  /** Message shown when rows is empty */
  emptyMessage?: string;
  /** Pagination config — rendered below the table when provided */
  pagination?: TablePaginationProps;
}

/**
 * Generic, accessible, responsive data table.
 *
 * Features:
 * - Semantic HTML: `<table>`, `<thead>`, `<tbody>`, `scope="col"`
 * - Keyboard accessible rows (Enter / Space triggers onRowClick)
 * - Focus ring via theme `MuiTableRow` override
 * - Empty-state row with configurable message
 * - Optional built-in pagination
 * - All styles driven by tokens — zero hardcoded hex values
 */
export function DataTable<T extends object>({
  columns,
  rows,
  onRowClick,
  ariaLabel = 'tabla de datos',
  emptyMessage = 'No se encontraron resultados.',
  pagination,
}: DataTableProps<T>) {
  const isClickable = typeof onRowClick === 'function';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick!(row);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${tokens.table.border}`,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
        <Table aria-label={ariaLabel}>
          {/* ── Head ────────────────────────────────────────────────────── */}
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  scope="col"
                  align={col.align ?? 'left'}
                  sx={{ width: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ── Body ────────────────────────────────────────────────────── */}
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={idx}
                  hover={isClickable}
                  tabIndex={isClickable ? 0 : undefined}
                  onClick={isClickable ? () => onRowClick!(row) : undefined}
                  onKeyDown={isClickable ? (e) => handleKeyDown(e, row) : undefined}
                  aria-label={isClickable ? 'ver detalle' : undefined}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align ?? 'left'}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ borderTop: `1px solid ${tokens.table.border}`, p: 2 }}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </Box>
      )}
    </Box>
  );
}
