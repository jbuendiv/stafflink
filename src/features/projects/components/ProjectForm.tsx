import React, { useState, useEffect } from 'react';
import { Project, ClientManager, Client } from '@/types';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { FormRow } from '@/shared/ui/layout/FormRow';
import { TextInput } from '@/shared/ui/form-components/TextInput';
import { SelectField } from '@/shared/ui/form-components/SelectField';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';

const OPTIONS_LIMIT = 5;
const filterOptions = createFilterOptions({
  limit: OPTIONS_LIMIT,
});

interface ProjectFormProps {
  project: Project | null;
  allProjects: Project[];
  allManagers: ClientManager[];
  allClients: Client[];
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ESTADOS = ['Planned', 'In Progress', 'Completed'];
const ESTADOS_OPTIONS = ESTADOS.map(estado => ({ id: estado, nombre: estado }));

export function ProjectForm({ 
  project, 
  allProjects, 
  allManagers, 
  allClients, 
  onSave, 
  onCancel 
}: ProjectFormProps) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [codigoProyecto, setCodigoProyecto] = useState('');
  const [managerId, setManagerId] = useState('');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [technicalLeadId, setTechnicalLeadId] = useState('');
  const [estado, setEstado] = useState('Planned');

  const isValidCode = (code: string) => /^INT-\d{6}-\d{5}$/.test(code);

  const codigoError = codigoProyecto && !isValidCode(codigoProyecto)
    ? "El código debe tener el formato INT-XXXXXX-XXXXX (ej. INT-123456-12345)"
    : codigoProyecto && isValidCode(codigoProyecto) && allProjects.some(p => p.codigoProyecto === codigoProyecto.trim() && p.id !== project?.id)
      ? "Este código de proyecto ya está en uso"
      : "";

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientId(project.clientId || '');
      setCodigoProyecto(project.codigoProyecto || '');
      setManagerId(project.managerId || '');
      setProjectManagerId(project.projectManagerId || '');
      setTechnicalLeadId(project.technicalLeadId || '');
      setEstado(project.estado || 'Planned');
    } else {
      setName('');
      setClientId('');
      setCodigoProyecto(`INT-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(10000 + Math.random() * 90000)}`);
      setManagerId('');
      setProjectManagerId('');
      setTechnicalLeadId('');
      setEstado('Planned');
    }
  }, [project]);

  const handleSave = () => {
    if (!name.trim() || !clientId || !codigoProyecto.trim() || !managerId || !estado) return;

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
      startDate: project?.startDate || null,
      endDate: project?.endDate || null,
    };
    
    onSave(savedProject);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormRow>
        <TextInput
          label="Nombre del Proyecto"
          value={name}
          onChange={(val) => setName(val)}
          required
        />

        <TextInput
          label="Código Proyecto"
          value={codigoProyecto}
          onChange={(val) => setCodigoProyecto(val)}
          required
          disabled={!!project}
          error={codigoError}
        />
      </FormRow>

      <FormRow>
        <Autocomplete
          fullWidth
          options={allClients}
          filterOptions={filterOptions as any}
          getOptionLabel={(option) => option?.name || ''}
          value={allClients.find(c => c.id === clientId) || null}
          onChange={(event, newValue) => setClientId(newValue?.id || '')}
          renderInput={(params) => (
            <TextField {...params} label="Cliente *" required={false} placeholder="Buscar cliente..." />
          )}
        />

        <Autocomplete
          fullWidth
          options={allManagers}
          filterOptions={filterOptions as any}
          getOptionLabel={(option) => option?.name || ''}
          value={allManagers.find(m => m.id === managerId) || null}
          onChange={(event, newValue) => setManagerId(newValue?.id || '')}
          renderInput={(params) => (
            <TextField {...params} label="Manager *" required={false} placeholder="Buscar manager..." />
          )}
        />
      </FormRow>

      <FormRow>
        <Autocomplete
          fullWidth
          options={allManagers}
          filterOptions={filterOptions as any}
          getOptionLabel={(option) => option?.name || ''}
          value={allManagers.find(m => m.id === projectManagerId) || null}
          onChange={(event, newValue) => setProjectManagerId(newValue?.id || '')}
          renderInput={(params) => (
            <TextField {...params} label="Project Manager" placeholder="Buscar project manager..." />
          )}
        />

        <Autocomplete
          fullWidth
          options={allManagers}
          filterOptions={filterOptions as any}
          getOptionLabel={(option) => option?.name || ''}
          value={allManagers.find(m => m.id === technicalLeadId) || null}
          onChange={(event, newValue) => setTechnicalLeadId(newValue?.id || '')}
          renderInput={(params) => (
            <TextField {...params} label="Technical Lead" placeholder="Buscar technical lead..." />
          )}
        />
      </FormRow>

      <FormRow>
        <SelectField
          label="Estado"
          value={estado}
          onChange={(val) => setEstado(val)}
          options={ESTADOS_OPTIONS}
          required
        />
        
        {/* Placeholder div so it doesn't take full width in grid if odd element */}
        <div />
      </FormRow>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          variant="outlined" 
          startIcon={<CancelIcon />}
          sx={{ textTransform: 'none', borderRadius: '24px' }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: '24px' }}
          disabled={!name.trim() || !clientId || !codigoProyecto.trim() || !!codigoError || !managerId || !estado}
        >
          {project ? "Guardar Cambios" : "Crear Proyecto"}
        </Button>
      </Box>
    </Box>
  );
}
