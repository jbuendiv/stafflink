import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { VacationRequest } from '../../../types';

interface VacationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRequests: VacationRequest[];
  onSave: (request: VacationRequest) => void;
  employeeId: string;
}

export function VacationRequestModal({ isOpen, onClose, existingRequests, onSave, employeeId }: VacationRequestModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!startDate || !endDate || !!error) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check overlaps
    const hasOverlap = existingRequests.some(req => {
      if (req.status === 'Rejected') return false; // Rejected don't overlap
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);
      return start <= reqEnd && end >= reqStart;
    });

    if (hasOverlap) {
      setError('Existen vacaciones solapadas en tu calendario.');
      return;
    }

    // Since we mock the Calendar check, we just save it
    const newRequest: VacationRequest = {
      id: `req-new-${Date.now()}`,
      employeeId,
      startDate,
      endDate,
      status: 'Pending',
    };

    onSave(newRequest);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BeachAccessIcon sx={{ color: '#1a56db' }} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: '#1f2937' }}>
            Solicitar Vacaciones
          </Typography>
        </Box>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, px: 3, pb: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', color: '#6b7280' }}>
          Selecciona el periodo para el cual deseas solicitar tus vacaciones.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Fecha de Inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' }
              }}
            />

            <TextField
              label="Fecha de Fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' }
              }}
            />
          </Box>
          
          {businessDays > 0 && (
            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
              <Typography variant="body2" sx={{ color: '#1e3a8a', textAlign: 'center' }}>
                Estás solicitando <strong>{businessDays}</strong> días laborables
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: '#6b7280', textTransform: 'none', fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!startDate || !endDate || !!error}
          disableElevation
          sx={{ 
            bgcolor: '#1a56db', 
            textTransform: 'none', 
            fontWeight: 600, 
            borderRadius: 2,
            px: 3,
            '&:hover': {
              bgcolor: '#1e3a8a'
            }
          }}
        >
          Solicitar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
