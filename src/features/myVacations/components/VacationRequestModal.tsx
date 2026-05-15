import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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
      let days = 0;
      const current = new Date(startDate);
      const end = new Date(endDate);
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // Not Sunday and Not Saturday
          days++;
        }
        current.setDate(current.getDate() + 1);
      }
      setBusinessDays(days);
    } else {
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
    if (!startDate || !endDate) return;

    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // including start and end days
    
    if (diffDays > 31) {
      setError('El rango de fechas no puede exceder los 31 días naturales.');
      return;
    }

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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          Solicitar Vacaciones
        </Typography>
        <IconButton aria-label="Cerrar modal" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="Fecha de Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {businessDays > 0 && (
            <Typography variant="body2" color="text.secondary">
              Días laborables solicitados: <strong>{businessDays}</strong>
            </Typography>
          )}
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
          disabled={!startDate || !endDate}
        >
          Enviar Solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
}
