import React, { useState, useEffect } from 'react';
import { MonthlyCalendar, Office } from '../../../types';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendar: MonthlyCalendar | null;
  allOffices: Office[];
  existingCalendars: MonthlyCalendar[];
  onSave: (calendar: MonthlyCalendar) => void;
  defaultOfficeId?: string;
  defaultMonth?: number;
  defaultYear?: number;
}

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

export function CalendarModal({ isOpen, onClose, calendar, allOffices, existingCalendars, onSave, defaultOfficeId, defaultMonth, defaultYear }: CalendarModalProps) {
  const [officeId, setOfficeId] = useState('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [workingHours, setWorkingHours] = useState<number | ''>('');
  const [holidays, setHolidays] = useState<string[]>([]);
  const [newHoliday, setNewHoliday] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (calendar) {
      setOfficeId(calendar.officeId);
      setMonth(calendar.month);
      setYear(calendar.year);
      setWorkingHours(calendar.workingHours);
      setHolidays([...calendar.holidays]);
    } else {
      setOfficeId(defaultOfficeId || '');
      setMonth(defaultMonth || new Date().getMonth() + 1);
      setYear(defaultYear || new Date().getFullYear());
      setWorkingHours('');
      setHolidays([]);
    }
    setError('');
  }, [calendar, isOpen, defaultOfficeId, defaultMonth, defaultYear]);

  const handleAddHoliday = () => {
    if (!newHoliday) return;
    if (holidays.includes(newHoliday)) return;
    
    // Check if holiday matches current month and year
    const holidayDate = new Date(newHoliday);
    if (holidayDate.getMonth() + 1 !== month || holidayDate.getFullYear() !== year) {
      setError('El festivo debe pertenecer al mes y año seleccionados.');
      return;
    }

    setHolidays([...holidays, newHoliday].sort());
    setNewHoliday('');
    setError('');
  };

  const handleRemoveHoliday = (dateToRemove: string) => {
    setHolidays(holidays.filter(h => h !== dateToRemove));
  };

  const handleSave = () => {
    if (!officeId || !month || !year || workingHours === '') return;

    const selectedOffice = allOffices.find(o => o.id === officeId);
    if (!selectedOffice) return;

    // Validation: Check if a calendar for this office, month, and year already exists (and it's not the one we are editing)
    const isDuplicate = existingCalendars.some(
      c => c.officeId === officeId && c.month === month && c.year === year && c.id !== calendar?.id
    );

    if (isDuplicate) {
      setError('Ya existe un calendario para esta oficina, mes y año.');
      return;
    }

    const savedCalendar: MonthlyCalendar = {
      id: calendar ? calendar.id : `cal-new-${Date.now()}`,
      officeId: selectedOffice.id,
      officeName: selectedOffice.name,
      month,
      year: Number(year),
      workingHours: Number(workingHours),
      holidays,
    };
    
    onSave(savedCalendar);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {calendar ? 'Editar Calendario Laboral' : 'Nuevo Calendario Laboral'}
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
            disabled={!!calendar} // Avoid changing office if we are coming from a specific context
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small" required disabled={!!calendar}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                value={month}
                label="Mes"
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MONTHS.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Año"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              size="small"
              required
              fullWidth
              disabled={!!calendar}
            />
          </Box>

          <TextField
            fullWidth
            label="Horas Laborables del Mes"
            type="number"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value === '' ? '' : Number(e.target.value))}
            required
            size="small"
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Días Festivos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Añadir Festivo"
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                size="small"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddHoliday}
                disabled={!newHoliday}
              >
                Añadir
              </Button>
            </Box>
            
            {holidays.length > 0 ? (
              <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                {holidays.map((date) => (
                  <ListItem
                    key={date}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveHoliday(date)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={date} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay festivos definidos para este mes.
              </Typography>
            )}
          </Box>
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
          disabled={!officeId || !month || !year || workingHours === ''}
        >
          Guardar Configuración
        </Button>
      </DialogActions>
    </Dialog>
  );
}
