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
import { clienteService } from '@/entities/cliente/api/cliente-service';
import type { Client } from '@/types';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { MOCK_CLIENT_MANAGERS } from '@/data/mockData';

export const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [client, setClient] = useState<Client | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const isCreateMode = id === 'create';

  const loadData = () => {
    if (isCreateMode) {
      setClient(null);
      return;
    }
    if (!id) return;
    
    const clientData = clienteService.getById(id);
    if (clientData) {
      setClient(clientData);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSave = (data: Client) => {
    if (isCreateMode) {
      const newClient = clienteService.create(data);
      navigate('/clients');
    } else if (id) {
      clienteService.update(id, data);
      navigate(`/clients/${id}/ver`);
      loadData();
    }
  };

  const handleDeleteConfirm = () => {
    if (id && !isCreateMode) {
      clienteService.delete(id);
      navigate('/clients', { state: { message: 'Cliente eliminado', severity: 'success' } });
    }
  };

  const tabValue = useMemo(() => {
    if (isCreateMode) return 'editar';
    const path = location.pathname;
    if (path.endsWith('/editar')) return 'editar';
    return 'ver';
  }, [location.pathname, isCreateMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/clients/${id}/${newValue}`);
  };

  if (!isCreateMode && !client) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4">Cliente no encontrado</Typography>
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
            onClick={() => navigate('/clients')}
            sx={{ 
              textDecoration: 'none',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Listado de clientes
          </Link>
          <Typography variant="h6" color="text.primary">
            {isCreateMode ? 'Nuevo Cliente' : client?.name}
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
      {tabValue === 'ver' && client && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Información del Cliente
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Nivel</Typography>
              <Chip label={client.level} size="small" sx={{ fontWeight: 'bold' }} />
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Sector</Typography>
              <Typography variant="body1">{client.sector || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Manager</Typography>
              <Typography variant="body1">{client.manager?.name || '-'}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tab: Editar */}
      {tabValue === 'editar' && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            {isCreateMode ? 'Crear Cliente' : 'Editar Cliente'}
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <ClientForm
              client={client}
              allManagers={MOCK_CLIENT_MANAGERS}
              onSave={handleSave}
              onCancel={() => isCreateMode ? navigate('/clients') : navigate(`/clients/${id}/ver`)}
            />
          </Box>
        </Paper>
      )}

      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar a este cliente?
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
