import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// We import mock services to get the info
import { employeeService } from '../../../services/mockServices';
import { getOficinaNombre } from '../../../shared/mock/catalogs';
import type { Employee, VacationRequest } from '../../../types';
import { VacationRequestModal } from '../../myVacations/components/VacationRequestModal';
import { EmployeeForm } from '../../manage-employee/ui/EmployeeForm';
import { useEmployees } from '../../manage-employee/hooks/useEmployees';

export function EmployeeProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [allVacationRequests, setAllVacationRequests] = useState<VacationRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { updateEmployee, deleteEmployee } = useEmployees();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch employee
    const allEmployees = employeeService.getAll();
    let emp = allEmployees.find(e => e.id === id);
    if (!emp && id === '1' && allEmployees.length > 0) {
      // Mock fallback: if id is '1' and not found, maybe show first employee
      emp = allEmployees[0];
    }
    
    if (emp) {
      setEmployee(emp);
    } else {
      // Handle not found
      navigate('/employees');
    }

    // 2. Fetch vacations
    const saved = localStorage.getItem('vacationRequests');
    if (saved) {
      const parsed: VacationRequest[] = JSON.parse(saved);
      setAllVacationRequests(parsed);
      const empId = emp ? emp.id : id;
      const associatedRequests = parsed.filter(req => req.employeeId === `emp-${empId}` || req.employeeId === empId || req.employeeId === 'emp-1'); // Fallback to 'emp-1' for testing
      setVacations(associatedRequests);
    }
  }, [id, navigate]);

  const handleSaveVacation = (request: VacationRequest) => {
    const updatedRequests = [...allVacationRequests, request];
    setAllVacationRequests(updatedRequests);
    localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));

    const empId = employee ? employee.id : id;
    const associatedRequests = updatedRequests.filter(req => req.employeeId === `emp-${empId}` || req.employeeId === empId || req.employeeId === 'emp-1');
    setVacations(associatedRequests);
  };

  const handleSaveEdit = (data: any) => {
    if (id) {
      updateEmployee(id, data);
      const allEmployees = employeeService.getAll();
      const updatedEmp = allEmployees.find(e => e.id === id);
      if (updatedEmp) setEmployee(updatedEmp);
      setActiveTab(0);
    }
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteEmployee(id);
      navigate('/employees', { state: { message: 'Empleado eliminado', severity: 'success' } });
    }
  };

  if (!employee) return null;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: '#374151', fontSize: '0.875rem' }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link component={RouterLink} to="/employees" underline="hover" color="inherit">
            {employee.field_categoria || 'Employee'}
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            {employee.email || employee.name}
          </Typography>
        </Breadcrumbs>
        
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Eliminar
        </Button>
      </Box>

      {/* Tabs Layout matching screenshot */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 6 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} aria-label="employee profile tabs">
          <Tab label="Ver" />
          <Tab label="Atajos" />
          <Tab label="Editar" />
          <Tab label="Contacto" />
        </Tabs>
      </Box>

      {/* Header Profile showing always */}
      {activeTab !== 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, gap: 2, justifyContent: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: '3rem',
              bgcolor: '#4285F4',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            src={`https://i.pravatar.cc/150?u=${employee.id}`} // Dummy image
          >
            {employee.name[0]}
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {employee.name} {employee.surname}
          </Typography>
        </Box>
      )}

      {/* Content for Ver */}
      {activeTab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Información
            </Typography>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none', bgcolor: '#fafafa' }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Número de empleado</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{employee.field_num_empleado}</Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Categoría</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{employee.field_categoria || 'N/A'}</Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>BU</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{employee.field_bu || 'Technology'}</Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Division</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{employee.field_division || 'Digital Experience'}</Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Department</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{employee.field_department || 'No WebEx'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Responsable</Typography>
                  {employee.field_responsables?.length > 0 ? (
                    employee.field_responsables.map((r, i) => (
                      <Typography key={i} variant="body2" color="primary" sx={{ mb: 0.5, cursor: 'pointer' }}>
                        {r}@nttdata.com
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="primary" sx={{ mb: 2 }}>Sin asignar</Typography>
                  )}
                  <Box sx={{ mb: 1 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Estado del empleado</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'capitalize' }}>{employee.field_estado_empleado}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Vacations Column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Vacations
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setIsModalOpen(true)}
                sx={{ 
                  bgcolor: '#6366f1', 
                  borderRadius: '24px', 
                  px: 3, 
                  py: 0.5, 
                  textTransform: 'none', 
                  fontWeight: 'bold', 
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' } 
                }}
              >
                Request
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vacations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No vacations requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vacations.map((vac) => (
                      <TableRow key={vac.id}>
                        <TableCell>{vac.startDate}</TableCell>
                        <TableCell>{vac.endDate}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={vac.status === 'Pending' ? 'Pending' : vac.status === 'Approved' ? 'Approved' : 'Rejected'} 
                            sx={{ 
                              bgcolor: vac.status === 'Pending' ? '#f3f4f6' : vac.status === 'Approved' ? 'transparent' : '#f3f4f6', 
                              color: '#374151',
                              fontWeight: 500,
                              borderRadius: '8px',
                              minWidth: '100px'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3, borderBottom: 'none' }}>
                      <Link component={RouterLink} to="/projects" underline="hover" sx={{ color: '#1976d2' }}>
                        See my projects
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
        </Grid>
      )}

      {/* Content for Atajos (Dummy) */}
      {activeTab === 1 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h5">Atajos</Typography>
          <Typography variant="body1">No hay atajos configurados para este empleado.</Typography>
        </Box>
      )}

      {/* Content for Editar */}
      {activeTab === 2 && (
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <EmployeeForm
            employee={employee}
            onSave={handleSaveEdit}
            onCancel={() => setActiveTab(0)}
          />
        </Box>
      )}

      {/* Content for Contacto (Dummy) */}
      {activeTab === 3 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h5">Contacto</Typography>
          <Typography variant="body1">Información de contacto no disponible.</Typography>
        </Box>
      )}

      <VacationRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingRequests={allVacationRequests}
        onSave={handleSaveVacation}
        employeeId={employee ? `emp-${employee.id}` : `emp-${id}`}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar a {employee.name} {employee.surname}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
