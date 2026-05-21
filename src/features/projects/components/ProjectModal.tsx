import React, { useState, useEffect } from 'react';
import { Project, ClientManager, Client } from '../../../types';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { BaseModal } from '@/shared/ui/BaseModal';
import { tokens } from '@/app/providers/styles/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export function ProjectModal({
  isOpen,
  onClose,
  project,
  allProjects,
  allManagers,
  allClients,
  onSave,
}: ProjectModalProps) {
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

  // ── Seed form when opening ─────────────────────────────────────────────────
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
    } else {
      setName('');
      setClientId('');
      setCodigoProyecto(
        `INT-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(10000 + Math.random() * 90000)}`,
      );
      setManagerId('');
      setProjectManagerId('');
      setTechnicalLeadId('');
      setEstado('Planned');
      setStartDate('');
      setEndDate('');
    }
    setError('');
  }, [project, isOpen]);

  // ── Validation & save ─────────────────────────────────────────────────────
  const isValid = Boolean(
    name.trim() && clientId && codigoProyecto.trim() && managerId && estado,
  );

  const handleSave = () => {
    if (!isValid) return;

    const isDuplicateName = allProjects.some(
      (p) =>
        p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== project?.id,
    );
    if (isDuplicateName) {
      setError('Ya existe un proyecto con este nombre.');
      return;
    }

    const pattern = /^[A-Za-z]{3}-\d{6}-\d{5}$/;
    if (!pattern.test(codigoProyecto.trim())) {
      setError(
        'El código debe tener el formato AAA-000000-00000 (ej. INT-001000-13456).',
      );
      return;
    }

    const isDuplicateCode = allProjects.some(
      (p) =>
        p.codigoProyecto.toLowerCase() === codigoProyecto.trim().toLowerCase() &&
        p.id !== project?.id,
    );
    if (isDuplicateCode) {
      setError('Ya existe un proyecto con este código.');
      return;
    }

    const selectedClient = allClients.find((c) => c.id === clientId);
    if (!selectedClient) return;

    setError('');
    onSave({
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
    });
    onClose();
  };

  // ── Footer actions (passed to BaseModal) ──────────────────────────────────
  const actions = (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onClose}
        sx={{ textTransform: 'none' }}
      >
        Cancelar
      </Button>
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!isValid}
        sx={{
          textTransform: 'none',
          boxShadow: 'none',
          bgcolor: tokens.brand.main,
          '&:hover': { bgcolor: tokens.brand.dark },
        }}
      >
        {project ? 'Guardar Cambios' : 'Crear Proyecto'}
      </Button>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      maxWidth="sm"
      actions={actions}
    >
      <Box
        component="form"
        noValidate
        aria-label={project ? 'Formulario editar proyecto' : 'Formulario nuevo proyecto'}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {error && (
          <Alert severity="error" role="alert">
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Nombre del Proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          slotProps={{ htmlInput: { 'aria-label': 'Nombre del proyecto' } }}
        />

        <TextField
          fullWidth
          label="Código Proyecto"
          value={codigoProyecto}
          onChange={(e) => setCodigoProyecto(e.target.value)}
          required
          size="small"
          disabled={!!project}
          helperText={!project ? 'Formato: AAA-000000-00000' : undefined}
          slotProps={{ htmlInput: { 'aria-label': 'Código del proyecto' } }}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={allClients}
          getOptionLabel={(o) => o.name}
          value={allClients.find((c) => c.id === clientId) ?? null}
          onChange={(_, val) => setClientId(val?.id ?? '')}
          renderInput={(params) => (
            <TextField {...params} label="Cliente" required placeholder="Buscar cliente…" />
          )}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={allManagers}
          getOptionLabel={(o) => o.name}
          value={allManagers.find((m) => m.id === managerId) ?? null}
          onChange={(_, val) => setManagerId(val?.id ?? '')}
          renderInput={(params) => (
            <TextField {...params} label="Manager" required placeholder="Buscar manager…" />
          )}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={allManagers}
          getOptionLabel={(o) => o.name}
          value={allManagers.find((m) => m.id === projectManagerId) ?? null}
          onChange={(_, val) => setProjectManagerId(val?.id ?? '')}
          renderInput={(params) => (
            <TextField {...params} label="Project Manager" placeholder="Buscar project manager…" />
          )}
        />

        <Autocomplete
          size="small"
          fullWidth
          options={allManagers}
          getOptionLabel={(o) => o.name}
          value={allManagers.find((m) => m.id === technicalLeadId) ?? null}
          onChange={(_, val) => setTechnicalLeadId(val?.id ?? '')}
          renderInput={(params) => (
            <TextField {...params} label="Technical Lead" placeholder="Buscar technical lead…" />
          )}
        />

        <FormControl fullWidth size="small" required>
          <InputLabel id="modal-estado-label">Estado</InputLabel>
          <Select
            labelId="modal-estado-label"
            value={estado}
            label="Estado"
            onChange={(e) => setEstado(e.target.value)}
          >
            {ESTADOS.map((est) => (
              <MenuItem key={est} value={est}>
                {est}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
    </BaseModal>
  );
}
