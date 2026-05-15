import React, { useState, useEffect } from 'react';
import { OfficeVacation, Office } from '../../../types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

interface VacationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacation: OfficeVacation | null;
  allOffices: Office[];
  existingVacations: OfficeVacation[];
  onSave: (vacation: OfficeVacation) => void;
  defaultOfficeId?: string;
  defaultYear?: number;
}

export function VacationModal({ isOpen, onClose, vacation, allOffices, existingVacations, onSave, defaultOfficeId, defaultYear }: VacationModalProps) {
  const [officeId, setOfficeId] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState<number | ''>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vacation) {
      setOfficeId(vacation.officeId);
      setYear(vacation.year);
      setVacationDays(vacation.vacationDays);
    } else {
      setOfficeId(defaultOfficeId || '');
      setYear(defaultYear || new Date().getFullYear());
      setVacationDays('');
    }
    setError('');
  }, [vacation, isOpen, defaultOfficeId, defaultYear]);

  const handleSave = () => {
    if (!officeId || !year || vacationDays === '') return;

    if (Number(vacationDays) < 0 || Number(vacationDays) > 365) {
      setError('Los días introducidos no son coherentes.');
      return;
    }

    const selectedOffice = allOffices.find(o => o.id === officeId);
    if (!selectedOffice) return;

    // Validation: Check if a record for this office and year already exists (and it's not the one we are editing)
    const isDuplicate = existingVacations.some(
      c => c.officeId === officeId && c.year === year && c.id !== vacation?.id
    );

    if (isDuplicate) {
      setError('Ya existe un registro equivalente y genera duplicidad funcional.');
      return;
    }

    const savedVacation: OfficeVacation = {
      id: vacation ? vacation.id : `vac-new-${Date.now()}`,
      officeId: selectedOffice.id,
      officeName: selectedOffice.name,
      year: Number(year),
      vacationDays: Number(vacationDays)
    };
    
    onSave(savedVacation);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {vacation ? 'Editar Política de Vacaciones' : 'Nueva Política de Vacaciones'}
        </Typography>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Autocomplete
            size="small"
            fullWidth
            options={allOffices}
            getOptionLabel={(option) => option.name}
            value={allOffices.find(o => o.id === officeId) || null}
            onChange={(event, newValue) => setOfficeId(newValue?.id || '')}
            renderInput={(params) => (
              <TextField {...params} label="Oficina" required placeholder="Buscar oficina..." />
            )}
            disabled={!!vacation} // Not allowed to change office when editing
          />

          <TextField
            label="Año"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            size="small"
            required
            fullWidth
            disabled={!!vacation} // Not allowed to change year when editing
          />

          <TextField
            fullWidth
            label="Días de Vacaciones/Año"
            type="number"
            value={vacationDays}
            onChange={(e) => setVacationDays(e.target.value === '' ? '' : Number(e.target.value))}
            required
            size="small"
            slotProps={{ htmlInput: { min: 0 } }}
            helperText="Días laborables de vacaciones por defecto"
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
          disabled={!officeId || !year || vacationDays === ''}
        >
          Guardar Configuración
        </Button>
      </DialogActions>
    </Dialog>
  );
}
