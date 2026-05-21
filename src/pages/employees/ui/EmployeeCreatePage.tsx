import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Alert, Snackbar, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { EmployeeForm, useEmployees } from '@/features/manage-employee';
import type { CreateEmployeeDTO, UpdateEmployeeDTO } from '@/entities/employee/model/types';

export const EmployeeCreatePage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const { createEmployee } = useEmployees();

  const handleSave = (data: CreateEmployeeDTO | UpdateEmployeeDTO) => {
    try {
      createEmployee(data as CreateEmployeeDTO);
      navigate('/employees', { 
        state: { 
          message: 'Empleado creado exitosamente', 
          severity: 'success' 
        } 
      });
    } catch (error) {
      navigate('/employees', { 
        state: { 
          message: 'Error al crear el empleado', 
          severity: 'error' 
        } 
      });
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

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
        <Typography variant="h6" color="text.primary">
          Nuevo Empleado
        </Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Crear Empleado
        </Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <EmployeeForm
            employee={null}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Box>
      </Paper>

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
