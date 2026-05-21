import React, { useState, useEffect } from 'react';
import { Client, ClientManager } from '../../../types';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

import { BaseModal } from '@/shared/ui/BaseModal';
import { tokens } from '@/app/providers/styles/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** null → create mode */
  client: Client | null;
  allManagers: ClientManager[];
  onSave: (client: Client) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ClientModal({
  isOpen,
  onClose,
  client,
  allManagers,
  onSave,
}: ClientModalProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number | ''>('');
  const [sector, setSector] = useState('');
  const [managerId, setManagerId] = useState('');

  // ── Seed form ─────────────────────────────────────────────────────────────
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

  // ── Save ──────────────────────────────────────────────────────────────────
  const isValid = Boolean(name.trim() && level && managerId);

  const handleSave = () => {
    if (!isValid) return;
    const selectedManager = allManagers.find((m) => m.id === managerId);
    if (!selectedManager) return;

    onSave({
      id: client ? client.id : `client-new-${Date.now()}`,
      name: name.trim(),
      level: level as number,
      sector,
      manager: selectedManager,
    });
    onClose();
  };

  // ── Footer ────────────────────────────────────────────────────────────────
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
        {client ? 'Guardar Cambios' : 'Crear Cliente'}
      </Button>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={client ? 'Editar Cliente' : 'Nuevo Cliente'}
      maxWidth="sm"
      actions={actions}
    >
      <Box
        component="form"
        noValidate
        aria-label={client ? 'Formulario editar cliente' : 'Formulario nuevo cliente'}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
        />

        <FormControl fullWidth size="small" required>
          <InputLabel id="client-modal-level-label">Nivel</InputLabel>
          <Select
            labelId="client-modal-level-label"
            value={level}
            label="Nivel"
            onChange={(e) => setLevel(e.target.value as number)}
          >
            {[1, 2, 3].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          size="small"
          placeholder="Ej. Tecnología, Finanzas…"
        />

        <Autocomplete
          size="small"
          fullWidth
          options={allManagers}
          getOptionLabel={(o) => o.name}
          value={allManagers.find((m) => m.id === managerId) ?? null}
          onChange={(_, val) => setManagerId(val?.id ?? '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cliente Manager"
              required
              placeholder="Buscar manager…"
            />
          )}
        />
      </Box>
    </BaseModal>
  );
}
