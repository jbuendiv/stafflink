import React, { useState, useEffect } from 'react';
import { OfficeVacation, Office } from '@/types';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { FormRow } from '@/shared/ui/layout/FormRow';
import { TextInput } from '@/shared/ui/form-components/TextInput';
import {
  Box,
  Button,
  TextField,
  Autocomplete,
  Alert,
} from '@mui/material';

interface VacationFormProps {
  vacation: OfficeVacation | null;
  allOffices: Office[];
  existingVacations: OfficeVacation[];
  onSave: (vacation: Omit<OfficeVacation, 'id'> | OfficeVacation) => void;
  onCancel: () => void;
}

export function VacationForm({
  vacation,
  allOffices,
  existingVacations,
  onSave,
  onCancel
}: VacationFormProps) {
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
      setOfficeId('');
      setYear(new Date().getFullYear());
      setVacationDays('');
    }
    setError('');
  }, [vacation]);

  const handleSave = () => {
    if (!officeId || !year || vacationDays === '') return;

    if (Number(vacationDays) < 0 || Number(vacationDays) > 365) {
      setError('Los días introducidos no son coherentes.');
      return;
    }

    const selectedOffice = allOffices.find(o => o.id === officeId);
    if (!selectedOffice) return;

    // Check for duplicates
    const isDuplicate = existingVacations.some(
      c => c.officeId === officeId && c.year === year && c.id !== vacation?.id
    );

    if (isDuplicate) {
      setError('Ya existe un registro equivalente y genera duplicidad funcional.');
      return;
    }

    const savedData = {
      officeId: selectedOffice.id,
      officeName: selectedOffice.name,
      year: Number(year),
      vacationDays: Number(vacationDays)
    };

    onSave(vacation ? { ...savedData, id: vacation.id } : savedData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <FormRow>
        <Autocomplete
          fullWidth
          options={allOffices}
          getOptionLabel={(option) => option.name}
          value={allOffices.find(o => o.id === officeId) || null}
          onChange={(event, newValue) => setOfficeId(newValue?.id || '')}
          disabled={!!vacation}
          renderInput={(params) => (
            <TextField {...params} label="Oficina *" required={false} placeholder="Buscar oficina..." />
          )}
        />

        <TextField
          label="Año *"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          disabled={!!vacation}
          fullWidth
        />
      </FormRow>

      <FormRow>
        <TextField
          fullWidth
          label="Días de Vacaciones/Año *"
          type="number"
          value={vacationDays}
          onChange={(e) => setVacationDays(e.target.value === '' ? '' : Number(e.target.value))}
          slotProps={{ htmlInput: { min: 0 } }}
          helperText="Días laborables de vacaciones por defecto"
        />
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
          disabled={!officeId || !year || vacationDays === ''}
        >
          {vacation ? "Guardar Cambios" : "Crear Política"}
        </Button>
      </Box>
    </Box>
  );
}
