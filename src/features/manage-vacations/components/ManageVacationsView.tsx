// ============================================================
// IMPORTS
// ============================================================
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useManageVacations } from '../hooks/useManageVacations';
import { Pagination } from '../../../components/common/Pagination';
import type { VacationRequest } from '../../../types';

const ITEMS_PER_PAGE = 8;

const calculateBusinessDays = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return 0;
  let days = 0;
  const current = new Date(startStr);
  const end = new Date(endStr);
  
  // ensure time is zeroed if needed, but since it's date strings it should be fine
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Not Sunday and Not Saturday
      days++;
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

// ============================================================
// COMPONENT
// ============================================================
export function ManageVacationsView() {
  const { requests, updateRequestStatus } = useManageVacations();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Resolved'>('Pending');
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null);
  const [actionType, setActionType] = useState<'Approved' | 'Rejected' | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (filterStatus === 'Pending') return req.status === 'Pending';
      if (filterStatus === 'Resolved') return req.status !== 'Pending';
      return true;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [requests, filterStatus]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleOpenDialog = (request: VacationRequest, action: 'Approved' | 'Rejected') => {
    setSelectedRequest(request);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedRequest && actionType) {
      updateRequestStatus(selectedRequest.id, actionType);
      
      setSnackbarMessage(
        actionType === 'Approved' 
          ? 'Vacaciones aprobadas. Se han recalculado las asignaciones.' 
          : 'Vacaciones rechazadas.'
      );
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 800, color: '#111827', fontSize: '2.5rem' }}>
          Gestión de Vacaciones
        </Typography>
      </Box>

      {/* TABS / FILTERS */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {['Pending', 'Resolved', 'All'].map((status) => (
          <Button
            key={status}
            onClick={() => {
              setFilterStatus(status as any);
              setCurrentPage(1);
            }}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: filterStatus === status ? '#1f2937' : '#f3f4f6',
              color: filterStatus === status ? 'white' : '#4b5563',
              '&:hover': {
                bgcolor: filterStatus === status ? '#111827' : '#e5e7eb'
              }
            }}
          >
            {status === 'Pending' ? 'Pendientes' : status === 'Resolved' ? 'Resueltas' : 'Todas'}
          </Button>
        ))}
      </Box>

      {/* TABLE */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1.5fr', p: 3, pb: 2, borderBottom: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
          <Typography sx={{ fontWeight: 'bold', color: '#374151' }}>Empleado ID</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#374151' }}>Inicio</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#374151' }}>Fin</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#374151', textAlign: 'center' }}>Días</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#374151' }}>Estado</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#374151', textAlign: 'right' }}>Acciones</Typography>
        </Box>

        {paginatedRequests.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center', color: '#6b7280' }}>
            <Typography variant="h6">No hay solicitudes para mostrar</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {filterStatus === 'Pending' && '¡Genial! Tienes tu bandeja limpia.'}
            </Typography>
          </Box>
        ) : (
          paginatedRequests.map((req, index) => (
            <Box key={req.id}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1.5fr', 
                  p: 3, 
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#1f2937', fontWeight: 500 }}>{req.employeeId}</Typography>
                <Typography sx={{ color: '#4b5563' }}>{req.startDate}</Typography>
                <Typography sx={{ color: '#4b5563' }}>{req.endDate}</Typography>
                <Typography sx={{ color: '#4b5563', textAlign: 'center', fontWeight: 'bold' }}>
                  {calculateBusinessDays(req.startDate, req.endDate)}
                </Typography>
                <Box>
                  <Chip 
                    label={req.status === 'Pending' ? 'Pendiente' : req.status === 'Approved' ? 'Aprobada' : 'Rechazada'} 
                    sx={{ 
                      bgcolor: req.status === 'Pending' ? '#fef3c7' : req.status === 'Approved' ? '#dcfce7' : '#fee2e2', 
                      color: req.status === 'Pending' ? '#b45309' : req.status === 'Approved' ? '#15803d' : '#b91c1c', 
                      fontWeight: 600,
                      borderRadius: 2,
                    }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  {req.status === 'Pending' ? (
                    <>
                      <Button
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenDialog(req, 'Approved')}
                        sx={{
                          color: '#15803d',
                          bgcolor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: '8px',
                          '&:hover': { bgcolor: '#dcfce7', borderColor: '#86efac' }
                        }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenDialog(req, 'Rejected')}
                        sx={{
                          color: '#b91c1c',
                          bgcolor: '#fef2f2',
                          border: '1px solid #fecaca',
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: '8px',
                          '&:hover': { bgcolor: '#fee2e2', borderColor: '#fca5a5' }
                        }}
                      >
                        Rechazar
                      </Button>
                    </>
                  ) : (
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      Sin acciones (Resuelta)
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < paginatedRequests.length - 1 && (
                <Box sx={{ height: '1px', bgcolor: '#f3f4f6', mx: 3 }} />
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

      {/* CONFIRMATION DIALOG */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {actionType === 'Approved' ? '¿Aprobar vacaciones?' : '¿Rechazar vacaciones?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'Approved' 
              ? 'Esta acción aprobará la solicitud y disparará el proceso de recálculo de asignaciones. ¿Estás seguro?'
              : 'Esta acción rechazará la solicitud del empleado de forma definitiva.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            sx={{ color: '#6b7280', textTransform: 'none', fontWeight: 500 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained"
            sx={{ 
              bgcolor: actionType === 'Approved' ? '#15803d' : '#b91c1c',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': { bgcolor: actionType === 'Approved' ? '#166534' : '#991b1b' }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS SNACKBAR */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
