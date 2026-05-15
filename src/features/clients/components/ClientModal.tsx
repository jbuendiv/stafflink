import React, { useState, useEffect } from 'react';
import { Client, ClientManager } from '../../../types';
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

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null; // null means create mode
  allManagers: ClientManager[];
  onSave: (client: Client) => void;
}

export function ClientModal({ isOpen, onClose, client, allManagers, onSave }: ClientModalProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number | ''>('');
  const [sector, setSector] = useState('');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setLevel(client.level);
      setSector(client.sector);
      setManagerId(client.manager.id);
    } else {
      setName('');
      setLevel('');
      setSector('');
      setManagerId('');
    }
  }, [client, isOpen]);

  const handleSave = () => {
    if (!name.trim() || !level || !managerId) return;

    const selectedManager = allManagers.find(m => m.id === managerId);
    if (!selectedManager) return;
    
    const savedClient: Client = {
      id: client ? client.id : `client-new-${Date.now()}`,
      name: name.trim(),
      level: level as number,
      sector: sector,
      manager: selectedManager,
    };
    
    onSave(savedClient);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {client ? 'Editar Cliente' : 'Nuevo Cliente'}
        </Typography>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="small"
          />

          <FormControl fullWidth size="small" required>
            <InputLabel id="modal-level-select-label">Nivel</InputLabel>
            <Select
              labelId="modal-level-select-label"
              value={level}
              label="Nivel"
              onChange={(e) => setLevel(e.target.value as number)}
            >
              {[1, 2, 3].map(n => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            size="small"
            placeholder="Ej. Tecnología, Finanzas..."
          />

          <Autocomplete
            size="small"
            fullWidth
            options={allManagers}
            getOptionLabel={(option) => option.name}
            value={allManagers.find(m => m.id === managerId) || null}
            onChange={(event, newValue) => { setManagerId(newValue?.id || ''); }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Cliente Manager" 
                required 
                placeholder="Buscar manager..."
              />
            )}
          />
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
          disabled={!name.trim() || !level || !managerId}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
