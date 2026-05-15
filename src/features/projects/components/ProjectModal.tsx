import React, { useState, useEffect } from 'react';
import { Project, ClientManager, Client } from '../../../types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

import Alert from '@mui/material/Alert';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  allProjects: Project[];
  allManagers: ClientManager[];
  allClients: Client[];
  onSave: (project: Project) => void;
}

const ESTADOS = ['Planned', 'In Progress', 'Completed'];

export function ProjectModal({ isOpen, onClose, project, allProjects, allManagers, allClients, onSave }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [codigoProyecto, setCodigoProyecto] = useState('');
  const [managerId, setManagerId] = useState('');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [technicalLeadId, setTechnicalLeadId] = useState('');
  const [estado, setEstado] = useState('Planned');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientId(project.clientId);
      setCodigoProyecto(project.codigoProyecto);
      setManagerId(project.managerId);
      setProjectManagerId(project.projectManagerId);
      setTechnicalLeadId(project.technicalLeadId);
      setEstado(project.estado);
      setStartDate(project.startDate || '');
      setEndDate(project.endDate || '');
      setError('');
    } else {
      setName('');
      setClientId('');
      setCodigoProyecto(`INT-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(10000 + Math.random() * 90000)}`); // Auto-generate valid format
      setManagerId('');
      setProjectManagerId('');
      setTechnicalLeadId('');
      setEstado('Planned');
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }, [project, isOpen]);

  const handleSave = () => {
    if (!name.trim() || !clientId || !codigoProyecto.trim() || !managerId || !estado) return;

    const isDuplicateName = allProjects.some(
      p => p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== project?.id
    );

    if (isDuplicateName) {
      setError('Ya existe un proyecto con este nombre.');
      return;
    }

    const pattern = /^[A-Za-z]{3}-\d{6}-\d{5}$/;
    if (!pattern.test(codigoProyecto.trim())) {
      setError('El código de proyecto debe tener el formato AAA-000000-00000 (ej. INT-001000-13456)');
      return;
    }

    const isDuplicate = allProjects.some(
      p => p.codigoProyecto.toLowerCase() === codigoProyecto.trim().toLowerCase() && p.id !== project?.id
    );

    if (isDuplicate) {
      setError('Ya existe un proyecto con este código.');
      return;
    }

    setError('');
    const selectedClient = allClients.find(c => c.id === clientId);
    if (!selectedClient) return;

    const savedProject: Project = {
      id: project ? project.id : `proj-new-${Date.now()}`,
      name: name.trim(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      codigoProyecto: codigoProyecto.trim(),
      managerId,
      projectManagerId,
      technicalLeadId,
      estado,
      startDate: startDate || null,
      endDate: endDate || null,
    };
    
    onSave(savedProject);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </Typography>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            label="Nombre del Proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="small"
          />

          <TextField
            fullWidth
            label="Código Proyecto"
            value={codigoProyecto}
            onChange={(e) => setCodigoProyecto(e.target.value)}
            required
            size="small"
            disabled={!!project} // Cannot edit code after creation
          />

          <Autocomplete
            size="small"
            fullWidth
            options={allClients}
            getOptionLabel={(option) => option.name}
            value={allClients.find(c => c.id === clientId) || null}
            onChange={(event, newValue) => setClientId(newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Cliente" required placeholder="Buscar cliente..." />
            )}
          />

          <Autocomplete
            size="small"
            fullWidth
            options={allManagers}
            getOptionLabel={(option) => option.name}
            value={allManagers.find(m => m.id === managerId) || null}
            onChange={(event, newValue) => setManagerId(newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Manager" required placeholder="Buscar manager..." />
            )}
          />

          <Autocomplete
            size="small"
            fullWidth
            options={allManagers}
            getOptionLabel={(option) => option.name}
            value={allManagers.find(m => m.id === projectManagerId) || null}
            onChange={(event, newValue) => setProjectManagerId(newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Project Manager" placeholder="Buscar project manager..." />
            )}
          />

          <Autocomplete
            size="small"
            fullWidth
            options={allManagers}
            getOptionLabel={(option) => option.name}
            value={allManagers.find(m => m.id === technicalLeadId) || null}
            onChange={(event, newValue) => setTechnicalLeadId(newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Technical Lead" placeholder="Buscar technical lead..." />
            )}
          />

          <FormControl fullWidth size="small" required>
            <InputLabel id="modal-estado-select-label">Estado</InputLabel>
            <Select
              labelId="modal-estado-select-label"
              value={estado}
              label="Estado"
              onChange={(e) => setEstado(e.target.value)}
            >
              {ESTADOS.map(est => (
                <MenuItem key={est} value={est}>{est}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Fecha Inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} color="inherit" variant="outlined" sx={{ textTransform: 'none' }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained" 
          sx={{ textTransform: 'none', boxShadow: 'none' }}
          disabled={!name.trim() || !clientId || !codigoProyecto.trim() || !managerId || !estado}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
