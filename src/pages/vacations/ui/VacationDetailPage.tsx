import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link, Paper, Tabs, Tab } from '@mui/material';
import { vacationPolicyService } from '@/features/vacations/api/vacation-policy-service';
import { VacationForm } from '@/features/vacations/components/VacationForm';
import { MOCK_OFFICES } from '@/data/mockData';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

export function VacationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateMode = id === undefined;
  
  const allPolicies = vacationPolicyService.getAll();
  const policyItem = !isCreateMode ? allPolicies.find(v => v.id === id) || null : null;

  const handleSave = (vacation: any) => {
    if (vacation.id) {
      vacationPolicyService.update(vacation.id, vacation);
      navigate(`/area/vacaciones/${vacation.id}/ver`);
    } else {
      const newVacation = vacationPolicyService.create(vacation);
      navigate(`/area/vacaciones/${newVacation.id}/ver`);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate('/area/vacaciones');
    } else {
      navigate(`/area/vacaciones/${id}/ver`);
    }
  };

  const tabValue = useMemo(() => {
    if (isCreateMode) return 'editar';
    const path = location.pathname;
    if (path.endsWith('/editar')) return 'editar';
    return 'ver';
  }, [location.pathname, isCreateMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/area/vacaciones/${id}/${newValue}`);
  };

  if (!isCreateMode && !policyItem) {
    return (
      <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4">Política no encontrada</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link 
            color="inherit" 
            href="/area/vacaciones" 
            onClick={(e) => { e.preventDefault(); navigate('/area/vacaciones'); }}
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Políticas de Vacaciones
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            {isCreateMode ? 'Nueva Política' : 'Editar Política'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            bgcolor: '#eff6ff', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BeachAccessIcon sx={{ color: '#2563eb', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
              {isCreateMode ? 'Nueva Política de Vacaciones' : `Política de Vacaciones (${policyItem?.officeName || ''} - ${policyItem?.year || ''})`}
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', mt: 0.5 }}>
              Administrad los días de vacaciones por país u oficina.
            </Typography>
          </Box>
        </Box>
      </Box>

      {!isCreateMode && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Ver" value="ver" />
            <Tab label="Editar" value="editar" />
          </Tabs>
        </Box>
      )}

      {/* Tab: Ver */}
      {tabValue === 'ver' && policyItem && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
            Información de la Política
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Oficina</Typography>
              <Typography variant="body1">{policyItem.officeName}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Año</Typography>
              <Typography variant="body1">{policyItem.year}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>Días de Vacaciones por Defecto</Typography>
              <Typography variant="body1">{policyItem.vacationDays} días</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Tab: Editar */}
      {tabValue === 'editar' && (
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
          <VacationForm 
            vacation={policyItem}
            allOffices={MOCK_OFFICES}
            existingVacations={allPolicies}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Paper>
      )}
    </Box>
  );
}
