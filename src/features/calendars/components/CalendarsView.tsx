import React, { useState, useMemo } from 'react';
import { CalendarModal } from './CalendarModal';
import { MOCK_CALENDARS, MOCK_OFFICES } from '../../../data/mockData';
import { MonthlyCalendar } from '../../../types';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function CalendarsView() {
  const [calendars, setCalendars] = useState<MonthlyCalendar[]>(MOCK_CALENDARS);
  
  // View State
  const [officeFilter, setOfficeFilter] = useState<string>('off-1'); // Default to Madrid
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // System Date

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [calendarToEdit, setCalendarToEdit] = useState<MonthlyCalendar | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const offices = useMemo(() => MOCK_OFFICES, []);

  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;

  // Active Calendar
  const activeCalendar = useMemo(() => {
    return calendars.find(c => c.officeId === officeFilter && c.year === currentYear && c.month === currentMonthNum);
  }, [calendars, officeFilter, currentYear, currentMonthNum]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
  };

  const handleOpenModal = (calendar: MonthlyCalendar | null = null) => {
    setCalendarToEdit(calendar);
    setIsModalOpen(true);
  };

  const handleSaveCalendar = (savedCalendar: MonthlyCalendar) => {
    setCalendars(prev => {
      const exists = prev.find(c => c.id === savedCalendar.id);
      if (exists) {
        return prev.map(c => c.id === savedCalendar.id ? savedCalendar : c);
      } else {
        return [savedCalendar, ...prev];
      }
    });
  };

  const getMonthName = (monthNumber: number) => {
    return MONTHS.find(m => m.value === monthNumber)?.label || monthNumber.toString();
  };

  // Calendar Grid generation
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthNum, 0).getDate();
  }, [currentYear, currentMonthNum]);

  const firstDayOfWeek = useMemo(() => {
    const day = new Date(currentYear, currentMonthNum - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0 for Monday, 6 for Sunday
  }, [currentYear, currentMonthNum]);

  const formatDay = (day: number) => {
    return `${currentYear}-${String(currentMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isHoliday = (day: number) => {
    if (!activeCalendar) return false;
    const formattedDate = formatDay(day);
    return activeCalendar.holidays.includes(formattedDate);
  };

  const renderCalendarGrid = () => {
    const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => (
      <Box key={`blank-${i}`} sx={{ p: 2, borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }} />
    ));

    const totalCells = firstDayOfWeek + daysInMonth;
    const trailingBlanksCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const trailingBlanks = Array.from({ length: trailingBlanksCount }, (_, i) => (
       <Box key={`t-blank-${i}`} sx={{ p: 2, borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }} />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isHol = isHoliday(day);
      const dateObj = new Date(currentYear, currentMonthNum - 1, day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      return (
        <Box 
          key={day} 
          sx={{ 
            p: 1.5, 
            height: 120, 
            borderRight: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: isHol ? 'error.50' : (isWeekend ? 'grey.50' : 'background.paper'),
            color: isHol ? 'error.main' : 'text.primary',
            transition: 'background-color 0.2s',
            '&:hover': {
               bgcolor: isHol ? 'error.100' : 'grey.100'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: '500', mb: 1 }}>{day}</Typography>
          {isHol && (
            <Chip label="Festivo" size="small" color="error" sx={{ alignSelf: 'flex-start', fontSize: '0.7rem', height: 22 }} />
          )}
        </Box>
      );
    });

    return (
      <Box sx={{ mt: 3, borderTop: '1px solid #e0e0e0', borderLeft: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {WEEKDAYS.map(day => (
            <Box key={day} sx={{ p: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(255,255,255,0.2)', '&:last-child': { borderRight: 'none'} }}>
              {day}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {blanks}
          {days}
          {trailingBlanks}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Configuración de Calendarios
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<UploadFileIcon />}
          onClick={() => setIsImportModalOpen(true)}
          sx={{ 
            bgcolor: '#6366f1', 
            borderRadius: '24px', 
            px: 4, 
            py: 1.5, 
            textTransform: 'none', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' } 
          }}
        >
          Importar Registros
        </Button>
      </Box>

      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: 'white', p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Autocomplete
            size="small"
            options={offices}
            getOptionLabel={(option) => option.name}
            value={offices.find(o => o.id === officeFilter) || undefined}
            onChange={(event, newValue) => setOfficeFilter(newValue?.id || '')}
            renderInput={(params) => <TextField {...params} label="Seleccionar Oficina" />}
            sx={{ width: 280 }}
            disableClearable
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <IconButton onClick={handlePrevMonth} sx={{ bgcolor: '#f3f4f6' }}>
               <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center', fontWeight: '600', color: '#1f2937' }}>
               {getMonthName(currentMonthNum)} {currentYear}
            </Typography>
            <IconButton onClick={handleNextMonth} sx={{ bgcolor: '#f3f4f6' }}>
               <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {officeFilter ? (
        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: 'white', p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
              Calendario de {offices.find(o => o.id === officeFilter)?.name || 'Oficina'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {activeCalendar ? (
                <>
                  <Typography variant="body1" sx={{ color: '#6b7280', mr: 2 }}>
                    Horas laborables: <strong style={{ color: '#111827' }}>{activeCalendar.workingHours}h</strong>
                  </Typography>
                  <Button 
                    startIcon={<EditIcon />} 
                    variant="outlined" 
                    onClick={() => handleOpenModal(activeCalendar)}
                    sx={{
                      textTransform: 'none', 
                      borderRadius: '20px',
                      color: '#4b5563',
                      borderColor: '#d1d5db',
                      '&:hover': { bgcolor: '#f3f4f6', borderColor: '#9ca3af' }
                    }}
                  >
                    Editar Mes
                  </Button>
                </>
              ) : (
                <>
                  <Chip 
                    label="Sin configurar" 
                    sx={{ 
                      bgcolor: '#f3f4f6', 
                      color: '#4b5563', 
                      fontWeight: 500,
                      borderRadius: 4,
                    }} 
                  />
                  <Button 
                    startIcon={<CalendarMonthIcon />} 
                    variant="contained" 
                    onClick={() => handleOpenModal(null)}
                    sx={{
                      bgcolor: '#6366f1', 
                      borderRadius: '24px', 
                      px: 3, 
                      textTransform: 'none', 
                      fontWeight: 'bold', 
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' } 
                    }}
                  >
                    Crear Calendario
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {renderCalendarGrid()}
        </Box>
      ) : (
        <Box sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1px dashed #d1d5db', bgcolor: '#f9fafb' }}>
          <CalendarMonthIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#6b7280' }}>
            Selecciona una oficina para visualizar y configurar el calendario.
          </Typography>
        </Box>
      )}

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Importar Calendario</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sube un archivo <strong>.csv</strong> o <strong>.json</strong> con las horas laborables y los festivos mensuales.
          </Typography>
          <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />} sx={{ py: 1.5, borderStyle: 'dashed', borderWidth: 2 }}>
            Seleccionar Archivo
            <input type="file" hidden accept=".json,.csv" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                 setTimeout(() => {
                   setSnackbarMessage(`Archivo "${e.target.files![0].name}" procesado. Configuración importada con éxito.`);
                   setSnackbarOpen(true);
                   setIsImportModalOpen(false);
                 }, 600);
              }
            }} />
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsImportModalOpen(false)} color="inherit">Cancelar</Button>
        </DialogActions>
      </Dialog>

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calendar={calendarToEdit}
        allOffices={offices}
        existingCalendars={calendars}
        onSave={handleSaveCalendar}
        defaultOfficeId={officeFilter}
        defaultMonth={currentMonthNum}
        defaultYear={currentYear}
      />

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
