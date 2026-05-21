import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Vacation } from '../../../entities/vacaciones/model/types';

interface VacationRequestFormProps {
  existingRequests: Vacation[];
  onSave: (request: Omit<Vacation, 'id'>) => void;
  onCancel: () => void;
  employeeId: string;
}

export function VacationRequestForm({ existingRequests, onSave, onCancel, employeeId }: VacationRequestFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Calculate business days
  const [businessDays, setBusinessDays] = useState(0);

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // including start and end days
      
      if (diffDays > 30) {
        setError('No puedes solicitar más de 1 mes (30 días) de vacaciones seguidas.');
        setBusinessDays(0);
        return;
      }

      setError('');

      let days = 0;
      const current = new Date(startDate);
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // Not Sunday and Not Saturday
          days++;
        }
        current.setDate(current.getDate() + 1);
      }
      setBusinessDays(days);
    } else if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      setBusinessDays(0);
    } else {
      setError('');
      setBusinessDays(0);
    }
  }, [startDate, endDate]);

  const handleSave = () => {
    if (!startDate || !endDate || !!error) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check overlaps
    const hasOverlap = existingRequests.some(req => {
      if (req.field_estado === 'Rejected') return false; // Rejected don't overlap
      const reqStart = new Date(req.field_rango_vacaciones.start);
      const reqEnd = new Date(req.field_rango_vacaciones.end);
      return start <= reqEnd && end >= reqStart;
    });

    if (hasOverlap) {
      setError('Existen vacaciones solapadas en tu calendario.');
      return;
    }

    const newRequest: Omit<Vacation, 'id'> = {
      field_solicitante: employeeId,
      field_responsable: 'resp-1', // Mock responsible
      field_rango_vacaciones: {
        start: startDate,
        end: endDate,
      },
      field_estado: 'Pending',
    };

    onSave(newRequest);
    setStartDate('');
    setEndDate('');
  };

  return (
    <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white', mb: 3, p: 4, pt: 3.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 3 }}>
        Solicitar Vacaciones
      </Typography>
      
      <Box component="form" noValidate autoComplete="off">
        <Stack spacing={3}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              size="small"
              label="Fecha de Inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              size="small"
              label="Fecha de Fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          
          {businessDays > 0 && (
            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
              <Typography variant="body2" sx={{ color: '#1e3a8a', textAlign: 'center' }}>
                Estás solicitando <strong>{businessDays}</strong> días laborables
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button 
              variant="text" 
              color="inherit" 
              onClick={onCancel}
              sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'bold' }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave} 
              disabled={!startDate || !endDate || !!error}
              sx={{ 
                bgcolor: '#1a56db', 
                borderRadius: '24px', 
                px: 4, 
                textTransform: 'none', 
                fontWeight: 'bold', 
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1e3a8a', boxShadow: 'none' } 
              }}
            >
              Solicitar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

