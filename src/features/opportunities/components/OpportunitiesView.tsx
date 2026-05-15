import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { opportunityService } from '../../../services/mockServices';
import type { Opportunity } from '../../../types';

export function OpportunitiesView() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setOpportunities(opportunityService.getAll());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta oportunidad?')) {
      opportunityService.delete(id);
      setOpportunities(opportunityService.getAll());
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Oportunidades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/opportunities/create')}
          sx={{
            bgcolor: '#6366f1',
            borderRadius: '24px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' }
          }}
        >
          Crear Oportunidad
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f9fafb' }}>
            <TableRow>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Cliente</b></TableCell>
              <TableCell><b>Fecha Inicio</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell align="right"><b>Acciones</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No hay oportunidades registradas.
                </TableCell>
              </TableRow>
            ) : (
              opportunities.map((opp) => (
                <TableRow key={opp.id} hover>
                  <TableCell>{opp.name}</TableCell>
                  <TableCell>{opp.clientId || 'Sin cliente'}</TableCell>
                  <TableCell>{opp.startDate || 'No definida'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={opp.status} 
                      size="small"
                      color={opp.status === 'Ganada' ? 'success' : opp.status === 'Perdida' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/opportunities/edit/${opp.id}`)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(opp.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
