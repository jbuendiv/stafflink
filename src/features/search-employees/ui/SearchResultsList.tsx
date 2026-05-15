import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import type { EmployeeSearchResult } from '../lib/search-filters';
import {
  getOficinaName,
  getAreaName,
  getCategoriaName,
} from '@/shared/lib/catalogs';

interface SearchResultsListProps {
  results: EmployeeSearchResult[];
  isLoading: boolean;
}

// Helper para calcular horas libres totales
function calculateFreeHours(result: EmployeeSearchResult): number {
  if (!result.availability || result.availability.length === 0) {
    return 0;
  }

  const totalHours = result.availability.reduce(
    (sum: number, avail) => sum + avail.horasDisponibles,
    0
  );

  return totalHours;
}


export function SearchResultsList({ results, isLoading }: SearchResultsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const prevResultsLengthRef = useRef(results.length);

  // Resetear la página cuando cambien los resultados
  useEffect(() => {
    if (prevResultsLengthRef.current !== results.length) {
      setCurrentPage(1);
      prevResultsLengthRef.current = results.length;
    }
  }, [results.length]);

  // Calcular el total de páginas y los empleados a mostrar en la página actual
  const totalPages = Math.ceil(results.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const paginatedEmployees = results.slice(startIndex, startIndex + employeesPerPage);

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }} >
        <Typography variant="h6">
          Buscando empleados...
        </Typography>
      </Paper>
    );
  }

  if (results.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Alert severity="info">
          No se encontraron empleados que coincidan con los criterios de búsqueda.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h3" gutterBottom sx={{ fontSize: '1.5em' }}> 
          Resultados de Búsqueda
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Mostrando {startIndex + 1}-{Math.min(startIndex + employeesPerPage, results.length)} de {results.length} empleados
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h5">Nombre</Typography></TableCell>
              <TableCell><Typography variant="h5">Categoría</Typography></TableCell>
              <TableCell><Typography variant="h5">Área</Typography></TableCell>
              <TableCell><Typography variant="h5">Oficina</Typography></TableCell>
              <TableCell><Typography variant="h5">Skills</Typography></TableCell>
              <TableCell align="center"><Typography variant="h5">Horas libres</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((result) => {
              const freeHours = calculateFreeHours(result);
              const { employee } = result;
              
              return (
              <TableRow
                key={employee.id}
                hover
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="subtitle2">
                    {employee.name} {employee.surname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {employee.email}
                  </Typography>
                </TableCell>

                <TableCell>
                  {employee.field_categoria ? (
                    <Chip label={getCategoriaName(employee.field_categoria)} size="small" color="primary" />
                  ) : (
                    <Typography color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Typography>
                    {employee.field_area ? getAreaName(employee.field_area) : '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography>
                    {employee.field_oficina ? getOficinaName(employee.field_oficina) : '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {employee.skills && employee.skills.length > 0 ? (
                      employee.skills.map((skill: string) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        -
                      </Typography>
                    )}
                    {employee.skills && employee.skills.length > 3 && (
                      <Chip
                        label={`+${employee.skills.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2">
                    {freeHours.toFixed(2)} horas
                  </Typography>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, gap: 0.5 }}>
          {currentPage > 1 && (
            <>
              <Button
                onClick={() => setCurrentPage(1)}
                sx={{ minWidth: '40px', height: '40px', color: 'primary.main' }}
              >
                {'<<'}
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                sx={{ minWidth: '40px', height: '40px', color: 'primary.main' }}
              >
                {'<'}
              </Button>
            </>
          )}

          {currentPage > 3 && (
            <Box sx={{ minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
              ...
            </Box>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 5) return true;
              return page >= currentPage - 2 && page <= currentPage + 2;
            })
            .map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                sx={{
                  minWidth: '40px',
                  height: '40px',
                  bgcolor: page === currentPage ? 'primary.main' : 'transparent',
                  color: page === currentPage ? '#fff' : '#000',
                  '&:hover': {
                    bgcolor: page === currentPage ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {page}
              </Button>
            ))}

          {currentPage < totalPages - 2 && (
            <Box sx={{ minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
              ...
            </Box>
          )}

          {currentPage < totalPages && (
            <>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                sx={{ minWidth: '40px', height: '40px', color: 'primary.main' }}
              >
                {'>'}
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages)}
                sx={{ minWidth: '40px', height: '40px', color: 'primary.main' }}
              >
                {'>>'}
              </Button>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}
