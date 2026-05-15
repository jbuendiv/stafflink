// ============================================================
// IMPORTS
// ============================================================
import { useState, useEffect, type ReactElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { Employee } from '../../../types';
import { categorias, getOficinaNombre } from '../../../shared/mock/catalogs';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeImportDialog } from './EmployeeImportDialog';

// ============================================================
// CONSTANTS
// ============================================================
const employeesPerPage = 10;

// ============================================================
// COMPONENT
// ============================================================
export const EmployeeList = () => {
  // Estado para controlar la paginacióny el snackbar de mensajes
  const navigate = useNavigate();
  // Obtener la navegación previa para mostrar mensajes de éxito/error después de crear/editar empleados
  const location = useLocation();
  // Estado para controlar la página actual en la paginación
  const [currentPage, setCurrentPage] = useState(1);
  
  // Inicializar el estado del snackbar basado en la navegación previa
  const [snackbar, setSnackbar] = useState({
    open: !!location.state?.message,
    message: location.state?.message || '',
    severity: (location.state?.severity || 'success') as 'success' | 'error' | 'warning'
  });

  // Limpiar el estado de ubicación después de montar para que al recargar la página
  // o navegar hacia atrás/adelante no se vuelva a mostrar el mensaje.
  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Estado para el Dialog de confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    employee: Employee | null;
  }>({
    open: false,
    employee: null
  });

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const { employees, deleteEmployee, createEmployee, updateEmployee } = useEmployees();
  // Obtener permisos del usuario actual para mostrar/ocultar acciones

  // Calcular el total de páginas y los empleados a mostrar en la página actual
  const totalPages = Math.ceil(employees.length / employeesPerPage);
  // Calcular los empleados a mostrar en la página actual
  const startIndex = (currentPage - 1) * employeesPerPage;
  // Si el número de empleados es menor que el índice de inicio, mostrar la última página
  const paginatedEmployees = employees.slice(startIndex, startIndex + employeesPerPage);

  const getStatusColor = (status: string) => {
    return status === 'activo' ? 'success' : 'default';
  };

  const getCategoryName = (categoryId: string): string => {
    return categorias.find(c => c.id === categoryId)?.nombre || categoryId;
  };

  const getManagerNames = (managerIds: string[]): ReactElement => {
    if (!managerIds || managerIds.length === 0) return <>-</>;
    
    const names = managerIds
      .map(id => {
        const manager = employees.find(emp => emp.id === id);
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
  };

  // Handlers para el Dialog de eliminación
  const handleDeleteClick = (employee: Employee) => {
    setDeleteDialog({ open: true, employee });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, employee: null });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.employee) {
      const success = deleteEmployee(deleteDialog.employee.id);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `Empleado "${deleteDialog.employee.name} ${deleteDialog.employee.surname}" eliminado correctamente`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al eliminar el empleado',
          severity: 'error'
        });
      }
      
      setDeleteDialog({ open: false, employee: null });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" gutterBottom>
         Empleados
      </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setImportDialogOpen(true)}
          >
            Importar Excel/CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/employees/create')}
          >
            Crear Empleado
          </Button>
        </Box>
        
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h5">Nombre</Typography></TableCell>
              <TableCell><Typography variant="h5">Categoría</Typography></TableCell>
              <TableCell><Typography variant="h5">Responsable(s)</Typography></TableCell>
              <TableCell><Typography variant="h5">Carrera</Typography></TableCell>
              <TableCell><Typography variant="h5">Área</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay empleados disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => {
                return (
                  <TableRow 
                    key={employee.id} 
                    hover 
                    onClick={() => navigate(`/employees/${employee.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={`https://i.pravatar.cc/150?u=${employee.id}`}>{employee.name[0]}</Avatar>
                        <Typography variant="body1">{employee.name} {employee.surname}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(employee.field_categoria)}
                        color="primary"
                        size="medium"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" component="div">{getManagerNames(employee.field_responsables)}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body1">{employee.field_tipo_carrera || '-'}</Typography></TableCell>
                    <TableCell><Typography variant="body1">{employee.field_area || '-'}</Typography></TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 0.5 }}>
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

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4">Confirmar eliminación</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar al empleado{' '}
              <strong>
                {deleteDialog.employee?.name} {deleteDialog.employee?.surname}
              </strong>
              ?
              <br />
              <br />
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          position: 'fixed',
          top: '50% !important',
          left: '50% !important',
          right: 'auto !important',
          bottom: 'auto !important',
          transform: 'translate(-50%, -50%) !important',
          zIndex: 9999
        }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            minWidth: '500px',
            maxWidth: '700px',
            padding: '20px 32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            '& .MuiAlert-message': {
              typography: 'subtitle1'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <EmployeeImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImportComplete={(results) => {
          setSnackbar({
            open: true,
            message: `Importación completada: ${results.success} filas procesadas exitosamente. ${results.errors.length > 0 ? `Errores: ${results.errors.length}` : ''}`,
            severity: results.errors.length > 0 ? (results.success > 0 ? 'warning' : 'error') : 'success',
          });
        }}
        createEmployee={createEmployee}
        updateEmployee={updateEmployee}
        existingEmployees={employees}
      />
    </Container>
  );
};
