import { useParams, useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { employeeService } from '@/entities/employee/api';
import { vacacionesService } from '@/entities/vacaciones/api';
import type { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '@/entities/employee/model/types';
import type { Vacation } from '@/entities/vacaciones/model/types';
import { EmployeeForm } from '@/features/manage-employee';
import { VacationRequestForm } from '@/features/myVacations/components/VacationRequestForm';
import {
  getCategoriaName,
  getOficinaName,
  getAreaName,
  getDepartamentoName,
  getDivisionName,
  getBusinessUnitName,
  getTipoCarreraName,
  getSkillName,
  getIdiomaName,
} from '@/shared/lib/catalogs/catalog-helpers';

export const EmployeeDetailPage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRequestVacationOpen, setIsRequestVacationOpen] = useState(false);
  
  const actualId = id === 'user' ? 'user-1' : id;

  const loadData = async () => {
    if (!id || !actualId) return;

    setLoading(true);
    try {
      const [employeeData, vacationsData] = await Promise.all([
        employeeService.getById(actualId!),
        vacacionesService.getByEmployeeId(actualId!)
      ]);
      
      let emp = employeeData || null;
      if (!emp && actualId === 'user-1') {
        emp = {
          id: 'user-1',
          name: 'Usuario',
          surname: 'Prueba',
          email: 'josebuendiavico4@gmail.com',
          roles: ['USUARIO_AUTENTICADO', 'ADMINISTRADOR'],
          field_estado_empleado: 'activo',
          field_num_empleado: '000001',
          field_oficina: 'MAD',
          field_area: 'ARQ',
          field_department: 'FS',
          field_division: 'TECH',
          field_bu: 'BANK',
          field_categoria: 'DIR',
          field_tipo_carrera: 'MIX',
          skills: ['REACT', 'NODE', 'AWS'],
          idiomas: ['ES'],
          field_responsables: []
        };
      }
      setEmployee(emp);
      setVacations(vacationsData);
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleEditSave = (data: CreateEmployeeDTO | UpdateEmployeeDTO) => {
    if (id) {
      const actualId = id === 'user' ? 'user-1' : id;
      employeeService.update(actualId, data as UpdateEmployeeDTO);
      navigate(`/employees/${id}/ver`); // Mantener 'user' en la URL si lo es
      loadData(); // refresh
    }
  };

  const handleDeleteConfirm = () => {
    if (id) {
      const actualId = id === 'user' ? 'user-1' : id;
      employeeService.delete(actualId);
      navigate('/employees', { state: { message: 'Empleado eliminado', severity: 'success' } });
    }
  };

  const tabValue = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith('/editar')) return 'editar';
    if (path.endsWith('/contacto')) return 'contacto';
    return 'ver';
  }, [location.pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/employees/${id}/${newValue}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4">Empleado no encontrado</Typography>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
      'Approved': 'success',
      'Pending': 'warning',
      'Rejected': 'error'
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'Approved': 'Aprobada',
      'Pending': 'Pendiente',
      'Rejected': 'Rechazada'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#1976d2', '#dc004e', '#9c27b0', '#f57c00',
      '#388e3c', '#0288d1', '#7b1fa2', '#c2185b'
    ];
    const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
    return colors[charCode % colors.length];
  };

  const getManagerName = (managerId: string): string => {
    return managerId || '-';
  };

  const getSkillsText = (skillIds: string[]): string => {
    return skillIds.map(id => getSkillName(id)).join(', ') || '-';
  };

  const getIdiomasText = (idiomaIds: string[]): string => {
    return idiomaIds.map(id => getIdiomaName(id)).join(', ') || '-';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
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
            {employee.name} {employee.surname}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user?.email?.toLowerCase() !== employee?.email?.toLowerCase() && id !== 'user' && (
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="employee profile tabs">
          <Tab label="Ver" value="ver" />
          <Tab label="Editar" value="editar" />
          <Tab label="Contacto" value="contacto" />
        </Tabs>
      </Box>

      {/* Header Profile showing always if not Editing */}
      {tabValue !== 'editar' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              bgcolor: getAvatarColor(employee.name),
              fontWeight: 700,
              fontSize: '3rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          >
            {getInitials(employee.name, employee.surname)}
          </Avatar>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            {employee.name} {employee.surname}
          </Typography>
        </Box>
      )}

      {/* Tab: Ver */}
      {tabValue === 'ver' && (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: '0 0 60%' }}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none', bgcolor: '#fafafa' }}>
              <Typography variant="h3" sx={{ mb: 3 }}>
                Información
              </Typography>

              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 3,
                  mb: 3
                }}
              >
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Número Empleado
                    </Typography>
                    <Typography variant="body1">
                      {employee.field_num_empleado}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Categoría
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main' }}>
                      {getCategoriaName(employee.field_categoria)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Oficina
                    </Typography>
                    <Typography variant="body1">
                      {getOficinaName(employee.field_oficina)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Área
                    </Typography>
                    <Typography variant="body1">
                      {getAreaName(employee.field_area)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Departamento
                    </Typography>
                    <Typography variant="body1">
                      {getDepartamentoName(employee.field_department)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      División
                    </Typography>
                    <Typography variant="body1">
                      {getDivisionName(employee.field_division)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Business Unit
                    </Typography>
                    <Typography variant="body1">
                      {getBusinessUnitName(employee.field_bu)}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Estado
                    </Typography>
                    <Chip 
                      label={employee.field_estado_empleado}
                      color={employee.field_estado_empleado === 'activo' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Tipo de Carrera
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main' }}>
                      {getTipoCarreraName(employee.field_tipo_carrera ?? '')}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Responsable
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main' }}>
                      {(employee.field_responsables?.length ?? 0) > 0
                        ? getManagerName(employee.field_responsables![0])
                        : '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {employee.email}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Roles
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {employee.roles.map((role) => (
                        <Chip 
                          key={role}
                          label={role}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                      Idiomas
                    </Typography>
                    <Typography variant="body1">
                      {getIdiomasText(employee.idiomas)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: '100%', pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                  Skills
                </Typography>
                <Typography variant="body1">
                  {getSkillsText(employee.skills ?? [])}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: '0 0 38%' }}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3">
                  Vacaciones
                </Typography>
                  {id === 'user' && !isRequestVacationOpen && (
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => setIsRequestVacationOpen(true)}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Solicitar
                    </Button>
                  )}
                </Box>
                
                {isRequestVacationOpen && (
                  <Box sx={{ mb: 3 }}>
                    <VacationRequestForm
                      existingRequests={vacations}
                      onSave={(newVacation) => {
                        const mappedVacation: Vacation = {
                          ...newVacation,
                          id: `vac-${Date.now()}`
                        };
                        vacacionesService.create(mappedVacation);
                        setIsRequestVacationOpen(false);
                        loadData(); 
                      }}
                      onCancel={() => setIsRequestVacationOpen(false)}
                      employeeId={actualId || ''}
                    />
                  </Box>
                )}

                <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="h5" sx={{ fontWeight: 600 }}>Fecha Inicio</Typography></TableCell>
                      <TableCell><Typography variant="h5" sx={{ fontWeight: 600 }}>Fecha Fin</Typography></TableCell>
                      <TableCell><Typography variant="h5" sx={{ fontWeight: 600 }}>Estado</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vacations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay vacaciones registradas
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      vacations.map((vacation) => (
                        <TableRow key={vacation.id}>
                          <TableCell>{formatDate(vacation.field_rango_vacaciones.start)}</TableCell>
                          <TableCell>{formatDate(vacation.field_rango_vacaciones.end)}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(vacation.field_estado)}
                              color={getStatusColor(vacation.field_estado)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Tab: Editar */}
      {tabValue === 'editar' && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Editar Empleado
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <EmployeeForm
              employee={employee}
              onSave={handleEditSave}
              onCancel={() => navigate(`/employees/${id}/ver`)}
            />
          </Box>
        </Paper>
      )}

      {/* Tab: Contacto */}
      {tabValue === 'contacto' && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h5">Contacto</Typography>
          <Typography variant="body1">Información de contacto no disponible.</Typography>
        </Box>
      )}

      {/* Dialog para Eliminar */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar a {employee.name} {employee.surname}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
