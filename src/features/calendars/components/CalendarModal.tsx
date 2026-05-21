import React, { useState, useEffect } from 'react';
import { MonthlyCalendar, Office } from '../../../types';

import Button from '@mui/material/Button';
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
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

import { BaseModal } from '@/shared/ui/BaseModal';
import { tokens } from '@/app/providers/styles/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export function CalendarModal({
  isOpen,
  onClose,
  calendar,
  allOffices,
  existingCalendars,
  onSave,
  defaultOfficeId,
  defaultMonth,
  defaultYear,
}: CalendarModalProps) {
  const [officeId, setOfficeId] = useState('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [workingHours, setWorkingHours] = useState<number | ''>('');
  const [holidays, setHolidays] = useState<string[]>([]);
  const [newHoliday, setNewHoliday] = useState('');
  const [error, setError] = useState('');

  // ── Seed form ─────────────────────────────────────────────────────────────
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

  // ── Holidays helpers ──────────────────────────────────────────────────────
  const handleAddHoliday = () => {
    if (!newHoliday || holidays.includes(newHoliday)) return;

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
    setHolidays(holidays.filter((h) => h !== dateToRemove));
  };

  // ── Validation & save ─────────────────────────────────────────────────────
  const isValid = Boolean(officeId && month && year && workingHours !== '');

  const handleSave = () => {
    if (!isValid) return;

    const selectedOffice = allOffices.find((o) => o.id === officeId);
    if (!selectedOffice) return;

    const isDuplicate = existingCalendars.some(
      (c) =>
        c.officeId === officeId &&
        c.month === month &&
        c.year === year &&
        c.id !== calendar?.id,
    );
    if (isDuplicate) {
      setError('Ya existe un calendario para esta oficina, mes y año.');
      return;
    }

    onSave({
      id: calendar ? calendar.id : `cal-new-${Date.now()}`,
      officeId: selectedOffice.id,
      officeName: selectedOffice.name,
      month,
      year: Number(year),
      workingHours: Number(workingHours),
      holidays,
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
        Guardar Configuración
      </Button>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BaseModal
      open={isOpen}
      onClose={onClose}
      title={calendar ? 'Editar Calendario Laboral' : 'Nuevo Calendario Laboral'}
      maxWidth="sm"
      actions={actions}
    >
      <Box
        component="form"
        noValidate
        aria-label={
          calendar ? 'Formulario editar calendario' : 'Formulario nuevo calendario'
        }
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {error && (
          <Alert severity="error" role="alert">
            {error}
          </Alert>
        )}

        <Autocomplete
          size="small"
          fullWidth
          options={allOffices}
          getOptionLabel={(o) => o.name}
          value={allOffices.find((o) => o.id === officeId) ?? null}
          onChange={(_, val) => setOfficeId(val?.id ?? '')}
          disabled={!!calendar}
          renderInput={(params) => (
            <TextField {...params} label="Oficina" required placeholder="Buscar oficina…" />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <FormControl fullWidth size="small" required disabled={!!calendar}>
            <InputLabel id="cal-modal-month-label">Mes</InputLabel>
            <Select
              labelId="cal-modal-month-label"
              value={month}
              label="Mes"
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
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
          onChange={(e) =>
            setWorkingHours(e.target.value === '' ? '' : Number(e.target.value))
          }
          required
          size="small"
          slotProps={{ htmlInput: { min: 0 } }}
        />

        {/* ── Festivos ────────────────────────────────────────────────────── */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography
            component="h3"
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Días Festivos
          </Typography>

          <Box
            sx={{ display: 'flex', gap: 1, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}
          >
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
              sx={{ whiteSpace: 'nowrap' }}
            >
              Añadir
            </Button>
          </Box>

          {holidays.length > 0 ? (
            <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1 }} aria-label="Lista de festivos">
              {holidays.map((date) => (
                <ListItem
                  key={date}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={`Eliminar festivo ${date}`}
                      onClick={() => handleRemoveHoliday(date)}
                      size="small"
                      color="error"
                    >
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
    </BaseModal>
  );
}
