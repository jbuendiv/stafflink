import React, { useState, useMemo } from 'react';
import { VacationModal } from './VacationModal';
import { MOCK_OFFICE_VACATIONS, MOCK_OFFICES } from '../../../data/mockData';
import { OfficeVacation } from '../../../types';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EditIcon from '@mui/icons-material/Edit';
import { Pagination } from '../../../components/common/Pagination';

const ITEMS_PER_PAGE = 8;

export function VacationsView() {
  const [vacations, setVacations] = useState<OfficeVacation[]>(MOCK_OFFICE_VACATIONS);
  
  // State
  const [officeFilter, setOfficeFilter] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vacationToEdit, setVacationToEdit] = useState<OfficeVacation | null>(null);

  const offices = useMemo(() => MOCK_OFFICES, []);

  // Filtering
  const filteredVacations = useMemo(() => {
    return vacations.filter(v => officeFilter === '' || v.officeId === officeFilter);
  }, [vacations, officeFilter]);

  // Sorting: Year desc, then Office Name
  const sortedVacations = useMemo(() => {
    return [...filteredVacations].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.officeName.localeCompare(b.officeName);
    });
  }, [filteredVacations]);

  const totalPages = Math.ceil(sortedVacations.length / ITEMS_PER_PAGE);
  const paginatedVacations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedVacations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedVacations, currentPage]);

  const handleOpenModal = (vacation: OfficeVacation | null = null) => {
    setVacationToEdit(vacation);
    setIsModalOpen(true);
  };

  const handleSaveVacation = (savedVacation: OfficeVacation) => {
    setVacations(prev => {
      const exists = prev.find(v => v.id === savedVacation.id);
      if (exists) {
        return prev.map(v => v.id === savedVacation.id ? savedVacation : v);
      } else {
        return [savedVacation, ...prev];
      }
    });
  };

  const resetPage = () => setCurrentPage(1);

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Configuración de Políticas de Vacaciones
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<BeachAccessIcon />}
          onClick={() => handleOpenModal(null)}
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
          Crear Política Anual
        </Button>
      </Box>

      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, bgcolor: 'white', p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Autocomplete
            size="small"
            options={offices}
            getOptionLabel={(option) => option.name}
            value={offices.find(o => o.id === officeFilter) || null}
            onChange={(event, newValue) => {
              setOfficeFilter(newValue?.id || '');
              resetPage();
            }}
            renderInput={(params) => <TextField {...params} label="Todas las Oficinas" placeholder="Filtrar por oficina..." />}
            sx={{ width: 280 }}
          />

          <Typography variant="body2" sx={{ ml: 'auto', color: '#6b7280', fontWeight: 500 }}>
            Mostrando {sortedVacations.length} registro(s)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(100px, 0.5fr)', p: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Oficina</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Año</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Días de Vacaciones</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937', textAlign: 'right' }}>Acciones</Typography>
        </Box>
        
        {paginatedVacations.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#6b7280' }}>
            No se encontraron registros.
          </Box>
        ) : (
          paginatedVacations.map((vacation, index) => (
            <Box key={vacation.id}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(100px, 0.5fr)', 
                  p: 3, 
                  py: 2.5,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 600 }}>
                  {vacation.officeName}
                </Typography>
                <Typography sx={{ color: '#6b7280', fontSize: '1rem' }}>
                  {vacation.year}
                </Typography>
                <Box>
                  <Chip 
                    label={`${vacation.vacationDays} días`} 
                    sx={{ 
                      bgcolor: '#eff6ff', 
                      color: '#2563eb', 
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      borderRadius: 4,
                      height: 'auto',
                      py: 0.5
                    }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleOpenModal(vacation)}
                    startIcon={<EditIcon />}
                    sx={{ 
                      textTransform: 'none', 
                      borderRadius: '20px',
                      color: '#4b5563',
                      borderColor: '#d1d5db',
                      '&:hover': { bgcolor: '#f3f4f6', borderColor: '#9ca3af' }
                    }}
                  >
                    Editar
                  </Button>
                </Box>
              </Box>
              {index < paginatedVacations.length - 1 && (
                <Box sx={{ height: '1px', bgcolor: '#e5e7eb', mx: 3 }} />
              )}
            </Box>
          ))
        )}
        
        {totalPages > 1 && (
          <Box sx={{ borderTop: '1px solid #e5e7eb', p: 2 }}>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}
      </Box>

      <VacationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vacation={vacationToEdit}
        allOffices={offices}
        existingVacations={vacations}
        onSave={handleSaveVacation}
        defaultOfficeId={officeFilter}
        defaultYear={new Date().getFullYear()}
      />
    </Box>
  );
}
