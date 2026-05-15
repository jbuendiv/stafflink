import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Alert, Snackbar, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { EmployeeForm, useEmployees } from '@/features/manage-employee';
import type { UpdateEmployeeDTO } from '@/entities/employee/model/types';

export const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const { employees, updateEmployee } = useEmployees();
  const employee = employees.find(emp => emp.id === id);

  const handleSave = (data: UpdateEmployeeDTO) => {
    if (!employee) return;

    try {
      updateEmployee(employee.id, data);
      navigate('/employees', { 
        state: { 
          message: 'Empleado actualizado exitosamente', 
          severity: 'success' 
        } 
      });
    } catch (error) {
      navigate('/employees', { 
        state: { 
          message: 'Error al actualizar el empleado', 
          severity: 'error' 
        } 
      });
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  if (!employee) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Empleado no encontrado
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3 }}
      >
        <Link
          component="button"
          variant="h6"
          onClick={() => navigate('/employees')}
          sx={{ 
            textDecoration: 'none',
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Listado de usuarios
        </Link>
        <Typography variant="body1" color="text.primary">
          Editar Empleado
        </Typography>
      </Breadcrumbs>

      <Typography
        component="h1"
        sx={{ fontSize: '2.5rem', fontWeight: 'bold', mb: 3 }}
      >
        Editar Empleado
      </Typography>

      <Box>
        <EmployeeForm
          employee={employee}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
