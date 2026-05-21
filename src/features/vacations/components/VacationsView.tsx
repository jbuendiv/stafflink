import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_OFFICES } from '../../../data/mockData';
import { OfficeVacation } from '../../../types';
import { vacationPolicyService } from '../api/vacation-policy-service';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Pagination } from '@/shared/ui';

const ITEMS_PER_PAGE = 8;

export function VacationsView() {
  const navigate = useNavigate();
  const [vacations, setVacations] = useState<OfficeVacation[]>([]);
  
  // State
  const [officeFilter, setOfficeFilter] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setVacations(vacationPolicyService.getAll());
  }, []);

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
          onClick={() => navigate('/area/vacaciones/crear')}
          sx={{ 
            bgcolor: '#1a56db', 
            borderRadius: '24px', 
            px: 4, 
            py: 1.5, 
            textTransform: 'none', 
            fontWeight: 'bold', 
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1e3a8a', boxShadow: 'none' } 
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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(200px, 1fr)', p: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Oficina</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Año</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Días de Vacaciones</Typography>
        </Box>
        
        {paginatedVacations.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#6b7280' }}>
            No se encontraron registros.
          </Box>
        ) : (
          paginatedVacations.map((vacation, index) => (
            <Box key={vacation.id}>
              <Box
                role="row"
                tabIndex={0}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(200px, 1fr)',
                  p: 3,
                  py: 2.5,
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#f9fafb' },
                  '&:focus': { outline: '2px solid #1a56db', outlineOffset: '-2px', bgcolor: '#eff6ff' },
                  '&:focus-visible': { outline: '2px solid #1a56db', outlineOffset: '-2px', bgcolor: '#eff6ff' },
                }}
                onClick={() => navigate(`/area/vacaciones/${vacation.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/area/vacaciones/${vacation.id}`);
                  }
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
    </Box>
  );
}
