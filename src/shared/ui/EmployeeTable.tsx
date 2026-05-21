import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Alert,
  Avatar,
} from '@mui/material';
import type { Employee } from '@/types';
import { getAreaName, getCategoriaName } from '@/shared/lib/catalogs';
import { Pagination } from '@/shared/ui';
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
export interface EmployeeRow {
  employee: Employee;
}
 
export interface EmployeeTableProps {
  /** Rows for the current page (already paginated). */
  rows: EmployeeRow[];
 
  /** Full result set used to resolve manager names. */
  allRows: EmployeeRow[];
 
  /** Shows a loading placeholder when true. */
  isLoading?: boolean;
 
  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
 
  /**
   * Called when a row is clicked or activated via keyboard.
   * Defaults to `navigate('/employees/:id')` when omitted.
   */
  onRowClick?: (employee: Employee) => void;
}
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
function buildManagerNames(managerIds: string[], allRows: EmployeeRow[]): ReactElement {
  if (!managerIds || managerIds.length === 0) return <>-</>;
 
  const names = managerIds
    .map((id) => {
      const manager = allRows.find((r) => r.employee.id === id)?.employee;
      return manager ? `${manager.name} ${manager.surname}` : id;
    })
    .filter(Boolean);
 
  if (names.length === 0) return <>-</>;
 
  return (
    <>
      {names.map((name, index) => (
        <span key={index}>
          {name}
          {index < names.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
 
// ─── Component ────────────────────────────────────────────────────────────────
 
export const EmployeeTable = ({
  rows,
  allRows,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onRowClick,
}: EmployeeTableProps) => {
  const navigate = useNavigate();
 
  const handleRowActivate = (employee: Employee) => {
    if (onRowClick) {
      onRowClick(employee);
    } else {
      navigate(`/employees/${employee.id}`);
    }
  };
 
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <TableContainer component={Paper} elevation={0}>
        <Table aria-label="Tabla de empleados">
          {/* ── Head ── */}
          <TableHead>
            <TableRow>
              <TableCell scope="col">Nombre</TableCell>
              <TableCell scope="col">Categoría</TableCell>
              <TableCell scope="col">Responsable</TableCell>
              <TableCell scope="col">Carrera</TableCell>
              <TableCell scope="col">Área</TableCell>
            </TableRow>
          </TableHead>
 
          {/* ── Body ── */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    Cargando empleados…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Alert severity="info" sx={{ my: 2 }}>
                    No se encontraron empleados que coincidan con los criterios de búsqueda.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              rows.map(({ employee }) => (
                <TableRow
                  key={employee.id}
                  hover
                  tabIndex={0}
                  onClick={() => handleRowActivate(employee)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowActivate(employee);
                    }
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  {/* Name + avatar */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={
                          employee.user_picture ||
                          `https://i.pravatar.cc/150?u=${employee.id}`
                        }
                        alt={`${employee.name} ${employee.surname}`}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'primary.main',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {employee.name?.charAt(0).toUpperCase()}
                        {employee.surname?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: 'text.primary' }}
                        >
                          {employee.name} {employee.surname}
                        </Typography>
                        {employee.email && (
                          <Typography variant="caption" color="text.secondary">
                            {employee.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
 
                  {/* Category */}
                  <TableCell>
                    {employee.field_categoria ? (
                      <Chip
                        label={getCategoriaName(employee.field_categoria)}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(26, 86, 219, 0.1)',
                          color: 'primary.main',
                          fontWeight: 500,
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
 
                  {/* Manager */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {buildManagerNames(employee.field_responsables || [], allRows)}
                    </Typography>
                  </TableCell>
 
                  {/* Career */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {employee.field_tipo_carrera || '-'}
                    </Typography>
                  </TableCell>
 
                  {/* Area */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {employee.field_area ? getAreaName(employee.field_area) : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
 
      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
};