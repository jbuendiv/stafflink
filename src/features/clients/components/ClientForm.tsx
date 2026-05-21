import React, { useState, useEffect } from 'react';
import { Client, ClientManager } from '@/types';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
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

interface ClientFormProps {
  client: Client | null;
  allManagers: ClientManager[];
  onSave: (client: Client) => void;
  onCancel: () => void;
}

import { FormRow } from '@/shared/ui/layout/FormRow';
import { TextInput } from '@/shared/ui/form-components/TextInput';
import { SelectField } from '@/shared/ui/form-components/SelectField';

const LEVELS = [
  { id: '1', nombre: '1' },
  { id: '2', nombre: '2' },
  { id: '3', nombre: '3' },
];

export function ClientForm({ client, allManagers, onSave, onCancel }: ClientFormProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<string>('');
  const [sector, setSector] = useState('');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setLevel(client.level ? String(client.level) : '');
      setSector(client.sector || '');
      setManagerId(client.manager?.id || '');
    } else {
      setName('');
      setLevel('');
      setSector('');
      setManagerId('');
    }
  }, [client]);

  const handleSave = () => {
    if (!name.trim() || !level || !managerId) return;

    const selectedManager = allManagers.find(m => m.id === managerId);
    if (!selectedManager) return;
    
    const savedClient: Client = {
      id: client ? client.id : `client-new-${Date.now()}`,
      name: name.trim(),
      level: parseInt(level, 10),
      sector: sector,
      manager: selectedManager,
    };
    
    onSave(savedClient);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormRow>
        <TextInput
          label="Nombre"
          value={name}
          onChange={(val) => setName(val)}
          required
        />

        <SelectField
          label="Nivel"
          value={level}
          onChange={(val) => setLevel(val)}
          options={LEVELS}
          required
        />
      </FormRow>

      <FormRow>
        <TextInput
          label="Sector"
          value={sector}
          onChange={(val) => setSector(val)}
          placeholder="Ej. Tecnología, Finanzas..."
        />

        <Autocomplete
          fullWidth
          options={allManagers}
          filterOptions={filterOptions as any}
          getOptionLabel={(option) => option?.name || ''}
          value={allManagers.find(m => m.id === managerId) || null}
          onChange={(event, newValue) => { setManagerId(newValue?.id || ''); }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Cliente Manager *" 
              required={false} 
              placeholder="Buscar manager..."
            />
          )}
        />
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
          disabled={!name.trim() || !level || !managerId}
        >
          {client ? "Guardar Cambios" : "Crear Cliente"}
        </Button>
      </Box>
    </Box>
  );
}
