import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Employee } from '../../../types';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeImportDialog } from './EmployeeImportDialog';
import { SearchEmployeesForm } from '@/features/search-employees/ui/SearchEmployeesForm';
import { useEmployeeSearch } from '@/features/search-employees/hooks/useEmployeeSearch';
import { PageContainer, PageHeader, ResultsCount, EmployeeTable } from '@/shared/ui';

const EMPLOYEES_PER_PAGE = 10;

export const EmployeeList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: !!location.state?.message,
    message: (location.state?.message as string) || '',
    severity: ((location.state?.severity as string) || 'success') as 'success' | 'error' | 'warning',
  });

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; employee: Employee | null }>({
    open: false,
    employee: null,
  });

  const { deleteEmployee, createEmployee, updateEmployee } = useEmployees();

  const {
    results,
    criteria,
    updateCriteria,
    resetCriteria,
    triggerSearch,
    reloadEmployees,
    isLoading,
    startDate,
    endDate,
    setDateRange,
  } = useEmployeeSearch();

  useEffect(() => {
    setCurrentPage(1);
  }, [results.length]);

  const totalPages = Math.ceil(results.length / EMPLOYEES_PER_PAGE);
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const paginatedResults = results.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);

  const handleDeleteCancel = () => setDeleteDialog({ open: false, employee: null });

  const handleDeleteConfirm = () => {
    if (deleteDialog.employee) {
      const success = deleteEmployee(deleteDialog.employee.id);
      if (success) {
        setSnackbar({
          open: true,
          message: `Empleado "${deleteDialog.employee.name} ${deleteDialog.employee.surname}" eliminado correctamente`,
          severity: 'success',
        });
      }
      setDeleteDialog({ open: false, employee: null });
    }
  };

  return (
    <PageContainer>
      {/* Page header */}
      <PageHeader
        title="Gestión de Empleados"
        actions={[
          {
            label: 'Importar Excel/CSV',
            variant: 'outlined',
            onClick: () => setImportDialogOpen(true),
          },
          {
            label: 'Crear Empleado',
            icon: <AddIcon />,
            variant: 'contained',
            onClick: () => navigate('/employees/create'),
          },
        ]}
      />

      {/* Search form */}
      <SearchEmployeesForm
        criteria={criteria}
        onCriteriaChange={updateCriteria}
        onReset={resetCriteria}
        onSearch={triggerSearch}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={setDateRange}
      />

      {/* Results count */}
      <ResultsCount
        currentPage={currentPage}
        itemsPerPage={EMPLOYEES_PER_PAGE}
        totalItems={results.length}
      />

      {/* Data table */}
      <EmployeeTable
        rows={paginatedResults}
        allRows={results}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Import dialog */}
      <EmployeeImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        createEmployee={createEmployee}
        updateEmployee={updateEmployee}
        existingEmployees={results.map((r) => r.employee)}
        onImportComplete={({ success, errors }) => {
          reloadEmployees?.();
          setSnackbar({
            open: true,
            message:
              errors.length > 0
                ? `${success} importado(s), ${errors.length} error(es)`
                : `${success} empleado(s) importado(s) correctamente`,
            severity: errors.length > 0 ? 'warning' : 'success',
          });
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar al empleado{' '}
            <strong>
              {deleteDialog.employee?.name} {deleteDialog.employee?.surname}
            </strong>
            ? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success / error snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};