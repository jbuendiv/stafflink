import React, { useState, useMemo, useEffect } from 'react';
import { CalendarModal } from './CalendarModal';
import { MOCK_CALENDARS, MOCK_OFFICES } from '../../../data/mockData';
import { MonthlyCalendar } from '../../../types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { PageContainer, PageHeader } from '@/shared/ui';
import { tokens } from '@/app/providers/styles/theme';

const MONTHS = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
];
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function CalendarsView() {
  const [calendars, setCalendars] = useState<MonthlyCalendar[]>(() => {
    try {
      const s = localStorage.getItem('stafflink_calendars');
      if (s) return JSON.parse(s);
    } catch (_) { /* ignore */ }
    return MOCK_CALENDARS;
  });
  useEffect(() => { localStorage.setItem('stafflink_calendars', JSON.stringify(calendars)); }, [calendars]);

  const [officeFilter, setOfficeFilter] = useState('off-1');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarToEdit, setCalendarToEdit] = useState<MonthlyCalendar | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const offices = useMemo(() => MOCK_OFFICES, []);
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;

  const activeCalendar = useMemo(
    () => calendars.find((c) => c.officeId === officeFilter && c.year === currentYear && c.month === currentMonthNum),
    [calendars, officeFilter, currentYear, currentMonthNum],
  );

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  const handleOpenModal = (cal: MonthlyCalendar | null = null) => { setCalendarToEdit(cal); setIsModalOpen(true); };
  const handleSaveCalendar = (saved: MonthlyCalendar) => {
    setCalendars((prev) => prev.find((c) => c.id === saved.id) ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]);
    setSnackbarMessage('Calendario guardado correctamente.'); setSnackbarOpen(true);
  };

  const getMonthName = (n: number) => MONTHS.find((m) => m.value === n)?.label ?? String(n);
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonthNum, 0).getDate(), [currentYear, currentMonthNum]);
  const firstDayOfWeek = useMemo(() => { const d = new Date(currentYear, currentMonthNum - 1, 1).getDay(); return d === 0 ? 6 : d - 1; }, [currentYear, currentMonthNum]);
  const formatDay = (d: number) => `${currentYear}-${String(currentMonthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isHoliday = (d: number) => !!activeCalendar && activeCalendar.holidays.includes(formatDay(d));

  const border = `1px solid ${tokens.border.default}`;

  return (
    <PageContainer>
      <PageHeader
        title="Configuración de Calendarios"
        actionLabel="Importar Registros"
        actionIcon={<UploadFileIcon />}
        onAction={() => {/* TODO: import modal */}}
      />

      <Box component="section" aria-label="Filtro de oficina y navegación mensual"
        sx={{ border, borderRadius: 3, bgcolor: tokens.surface.card, p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Autocomplete size="small" options={offices} getOptionLabel={(o) => o.name}
          value={offices.find((o) => o.id === officeFilter) ?? undefined}
          onChange={(_, val) => setOfficeFilter(val?.id ?? '')}
          renderInput={(params) => <TextField {...params} label="Seleccionar Oficina" />}
          sx={{ width: 280 }} disableClearable />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <IconButton onClick={handlePrevMonth} aria-label="Mes anterior" sx={{ bgcolor: tokens.surface.hover }}><ChevronLeftIcon /></IconButton>
          <Typography variant="h6" component="time"
            dateTime={`${currentYear}-${String(currentMonthNum).padStart(2, '0')}`}
            sx={{ minWidth: 160, textAlign: 'center', fontWeight: 600, color: tokens.text.heading }}>
            {getMonthName(currentMonthNum)} {currentYear}
          </Typography>
          <IconButton onClick={handleNextMonth} aria-label="Mes siguiente" sx={{ bgcolor: tokens.surface.hover }}><ChevronRightIcon /></IconButton>
        </Box>
      </Box>

      {officeFilter ? (
        <Box component="section" aria-labelledby="calendar-heading"
          sx={{ border, borderRadius: 3, bgcolor: tokens.surface.card, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography id="calendar-heading" variant="h6" sx={{ fontWeight: 'bold', color: tokens.text.heading }}>
              Calendario de {offices.find((o) => o.id === officeFilter)?.name ?? 'Oficina'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {activeCalendar ? (
                <>
                  <Typography variant="body1" sx={{ color: tokens.text.muted }}>
                    Horas laborables: <strong style={{ color: tokens.text.heading }}>{activeCalendar.workingHours}h</strong>
                  </Typography>
                  <Button startIcon={<EditIcon />} variant="outlined" onClick={() => handleOpenModal(activeCalendar)}
                    sx={{ textTransform: 'none', borderRadius: '20px', color: tokens.text.body, borderColor: tokens.border.default, '&:hover': { bgcolor: tokens.surface.hover, borderColor: tokens.border.strong } }}>
                    Editar Mes
                  </Button>
                </>
              ) : (
                <>
                  <Chip label="Sin configurar" sx={{ bgcolor: tokens.surface.hover, color: tokens.text.body, fontWeight: 500 }} />
                  <Button startIcon={<CalendarMonthIcon />} variant="contained" onClick={() => handleOpenModal(null)}
                    sx={{ bgcolor: tokens.brand.main, borderRadius: '24px', px: 3, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: tokens.brand.dark, boxShadow: 'none' } }}>
                    Crear Calendario
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {/* Calendar grid */}
          <Box role="grid" aria-label={`Calendario ${getMonthName(currentMonthNum)} ${currentYear}`}
            sx={{ mt: 3, borderTop: border, borderLeft: border, borderRadius: 2, overflow: 'hidden' }}>
            {/* Weekday header row */}
            <Box role="row" sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {WEEKDAYS.map((day) => (
                <Box key={day} role="columnheader" aria-label={day}
                  sx={{ p: 1.5, bgcolor: tokens.brand.main, color: '#fff', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(255,255,255,0.2)', '&:last-child': { borderRight: 'none' } }}>
                  {day}
                </Box>
              ))}
            </Box>
            {/* Day cells */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <Box key={`b-${i}`} sx={{ p: 2, borderRight: border, borderBottom: border, bgcolor: tokens.surface.page }} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isHol = isHoliday(day);
                const dow = new Date(currentYear, currentMonthNum - 1, day).getDay();
                const isWeekend = dow === 0 || dow === 6;
                return (
                  <Box key={day} role="gridcell" aria-label={formatDay(day)}
                    sx={{ p: 1.5, minHeight: 100, borderRight: border, borderBottom: border, display: 'flex', flexDirection: 'column',
                      bgcolor: isHol ? '#fef2f2' : isWeekend ? tokens.surface.page : tokens.surface.card,
                      color: isHol ? 'error.main' : tokens.text.body, transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: isHol ? '#fee2e2' : tokens.surface.hover } }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>{day}</Typography>
                    {isHol && <Chip label="Festivo" size="small" color="error" sx={{ alignSelf: 'flex-start', fontSize: '0.7rem', height: 22 }} />}
                  </Box>
                );
              })}
              {Array.from({ length: (firstDayOfWeek + daysInMonth) % 7 === 0 ? 0 : 7 - ((firstDayOfWeek + daysInMonth) % 7) }, (_, i) => (
                <Box key={`e-${i}`} sx={{ p: 2, borderRight: border, borderBottom: border, bgcolor: tokens.surface.page }} />
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">Selecciona una oficina para ver su calendario.</Typography>
        </Box>
      )}

      {isModalOpen && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCalendar}
          calendar={calendarToEdit}
          allOffices={offices}
          existingCalendars={calendars}
          defaultOfficeId={officeFilter}
          defaultYear={currentYear}
          defaultMonth={currentMonthNum}
        />
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
