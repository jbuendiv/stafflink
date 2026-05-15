import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { employeeService } from '@/entities/employee/api';
import { vacacionesService } from '@/entities/vacaciones/api';
import type { Employee } from '@/entities/employee/model/types';
import type { Vacation } from '@/entities/vacaciones/model/types';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [employeeData, vacationsData] = await Promise.all([
          employeeService.getById(id),
          vacacionesService.getByEmployeeId(id)
        ]);
        
        setEmployee(employeeData || null);
        setVacations(vacationsData);
      } catch (error) {
        console.error('Error loading employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
          {employee.name} {employee.surname}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mr: 3,
            bgcolor: getAvatarColor(employee.name),
            fontWeight: 700
          }}
        >
          {getInitials(employee.name, employee.surname)}
        </Avatar>
        <Typography variant="h3" component="h1">
          {employee.name} {employee.surname}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: '0 0 60%' }}>
          <Paper sx={{ p: 3 }}>
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
                    {getTipoCarreraName(employee.field_tipo_carrera)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" color="text.secondary" sx={{ mb: 0.5 }}>
                    Responsable
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'primary.main' }}>
                    {employee.field_responsables.length > 0 
                      ? getManagerName(employee.field_responsables[0])
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
                {getSkillsText(employee.skills)}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '0 0 38%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              Vacaciones
            </Typography>

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
    </Container>
  );
};
