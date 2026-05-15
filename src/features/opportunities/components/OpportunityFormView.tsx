import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material';
import { opportunityService } from '../../../services/mockServices';
import type { CreateOpportunityDTO, Opportunity } from '../../../types';

export function OpportunityFormView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateOpportunityDTO>({
    name: '',
    clientId: '',
    managerId: '',
    projectManagerId: '',
    technicalLeadId: '',
    candidatos: [],
    startDate: '',
    endDate: '',
    status: 'Abierta'
  });

  useEffect(() => {
    if (isEdit && id) {
      const opps = opportunityService.getAll();
      const opp = opps.find(o => o.id === id);
      if (opp) {
        setFormData(opp);
      } else {
        navigate('/opportunities');
      }
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && id) {
      opportunityService.update(id, formData);
    } else {
      opportunityService.create(formData);
    }
    navigate('/opportunities');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem', mb: 3 }}>
        {isEdit ? 'Editar Oportunidad' : 'Crear Oportunidad'}
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="Nombre de la Oportunidad"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              label="Cliente (ID)"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Estado"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Abierta">Abierta</MenuItem>
              <MenuItem value="En curso">En curso</MenuItem>
              <MenuItem value="Ganada">Ganada</MenuItem>
              <MenuItem value="Perdida">Perdida</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha Inicio Prevista"
              name="startDate"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.startDate || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha Fin Prevista"
              name="endDate"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.endDate || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Manager (ID)"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Project Manager (ID)"
              name="projectManagerId"
              value={formData.projectManagerId}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Technical Lead (ID)"
              name="technicalLeadId"
              value={formData.technicalLeadId}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Candidatos (IDs separados por coma)"
              name="candidatos"
              value={formData.candidatos.join(', ')}
              onChange={(e) => {
                const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFormData(prev => ({ ...prev, candidatos: val }));
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/opportunities')}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
