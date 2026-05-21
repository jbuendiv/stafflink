import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { proyectoService } from '@/entities/proyecto/api/proyecto-service';
import type { Project } from '@/types';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { MOCK_CLIENT_MANAGERS, MOCK_CLIENTS } from '@/data/mockData';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const isCreateMode = id === 'create';

  const loadData = () => {
    if (isCreateMode) {
      setProject(null);
      return;
    }
    if (!id) return;
    
    const projectData = proyectoService.getById(id);
    if (projectData) {
      setProject(projectData);
    }
  };

    useEffect(() => {
        loadData();
    }, [id]);

  const handleSave = (data: Project) => {
    if (isCreateMode) {
      const newProject = proyectoService.create(data);
      navigate('/projects');
    } else if (id) {
      proyectoService.update(id, data);
      navigate(`/projects/${id}/ver`);
      loadData();
    }
  };

  const handleDeleteConfirm = () => {
    if (id && !isCreateMode) {
      proyectoService.delete(id);
      navigate('/projects', { state: { message: 'Proyecto eliminado', severity: 'success' } });
    }
  };

  const tabValue = useMemo(() => {
    if (isCreateMode) return 'editar';
    const path = location.pathname;
    if (path.endsWith('/editar')) return 'editar';
    return 'ver';
  }, [location.pathname, isCreateMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/projects/${id}/${newValue}`);
  };

  if (!isCreateMode && !project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4">Proyecto no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            component="button"
            variant="h6"
            onClick={() => navigate('/projects')}
            sx={{ 
              textDecoration: 'none',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Listado de proyectos
          </Link>
          <Typography variant="h6" color="text.primary">
            {isCreateMode ? 'Nuevo Proyecto' : project?.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isCreateMode && (
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteOpen(true)}
              sx={{ borderRadius: '24px' }}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </Box>

      {!isCreateMode && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Ver" value="ver" />
            <Tab label="Editar" value="editar" />
          </Tabs>
        </Box>
      )}

      {/* Tab: Ver */}
      {tabValue === 'ver' && project && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Información del Proyecto {project.codigoProyecto && `(${project.codigoProyecto})`}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Estado</Typography>
              <Chip label={project.estado || 'Planned'} size="small" />
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Cliente</Typography>
              <Typography variant="body1">{project.clientName}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Manager</Typography>
              <Typography variant="body1">{MOCK_CLIENT_MANAGERS.find(m => m.id === project.managerId)?.name || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Project Manager</Typography>
              <Typography variant="body1">{MOCK_CLIENT_MANAGERS.find(m => m.id === project.projectManagerId)?.name || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Technical Lead</Typography>
              <Typography variant="body1">{MOCK_CLIENT_MANAGERS.find(m => m.id === project.technicalLeadId)?.name || '-'}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tab: Editar */}
      {tabValue === 'editar' && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            {isCreateMode ? 'Crear Proyecto' : 'Editar Proyecto'}
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <ProjectForm
              project={project}
              allProjects={proyectoService.getAll()}
              allManagers={MOCK_CLIENT_MANAGERS}
              allClients={MOCK_CLIENTS}
              onSave={handleSave}
              onCancel={() => isCreateMode ? navigate('/projects') : navigate(`/projects/${id}/ver`)}
            />
          </Box>
        </Paper>
      )}

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar este proyecto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteOpen(false)} color="inherit" sx={{ borderRadius: '24px' }}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: '24px' }}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
