import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useManageVacations } from '../hooks/useManageVacations';
import { DataTable, type Column } from '@/shared/ui/DataTable';
import { PageContainer } from '@/shared/ui/PageContainer';
import { tokens } from '@/app/providers/styles/theme';
import type { Vacation } from '@/entities/vacaciones/model/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

const FILTER_LABELS: Record<string, string> = {
  Pending: 'Pendientes',
  Resolved: 'Resueltas',
  All: 'Todas',
};

function calculateBusinessDays(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  let days = 0;
  const current = new Date(startStr);
  const end = new Date(endStr);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) days++;
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface VacationStatusChipProps {
  status: Vacation['field_estado'];
}

function VacationStatusChip({ status }: VacationStatusChipProps) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    Pending: {
      bg: tokens.status.pendingBg,
      color: tokens.status.pendingText,
      label: 'Pendiente',
    },
    Approved: {
      bg: tokens.status.approvedBg,
      color: tokens.status.approvedText,
      label: 'Aprobada',
    },
    Rejected: {
      bg: tokens.status.rejectedBg,
      color: tokens.status.rejectedText,
      label: 'Rechazada',
    },
  };
  const { bg, color, label } = styles[status] ?? styles.Pending;
  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: bg, color, fontWeight: 600, borderRadius: 2 }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManageVacationsView() {
  const { requests, updateRequestStatus, loading } = useManageVacations();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Resolved'>('Pending');

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Vacation | null>(null);
  const [actionType, setActionType] = useState<'Approved' | 'Rejected' | null>(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const filteredRequests = useMemo(
    () =>
      requests
        .filter((req) => {
          if (filterStatus === 'Pending') return req.field_estado === 'Pending';
          if (filterStatus === 'Resolved') return req.field_estado !== 'Pending';
          return true;
        })
        .sort(
          (a, b) =>
            new Date(a.field_rango_vacaciones.start).getTime() -
            new Date(b.field_rango_vacaciones.start).getTime(),
        ),
    [requests, filterStatus],
  );

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleOpenDialog = (request: Vacation, action: 'Approved' | 'Rejected') => {
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
          : 'Vacaciones rechazadas.',
      );
      setSnackbarOpen(true);
    }
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  // ── Column definitions ──────────────────────────────────────────────────────
  const columns: Column<Vacation>[] = [
    {
      key: 'field_solicitante',
      label: 'Empleado',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: tokens.text.body }}>
          {row.field_solicitante || 'Desconocido'}
        </Typography>
      ),
    },
    {
      key: 'start',
      label: 'Inicio',
      render: (row) => (
        <Typography variant="body2" color={tokens.text.secondary}>
          {row.field_rango_vacaciones.start}
        </Typography>
      ),
    },
    {
      key: 'end',
      label: 'Fin',
      render: (row) => (
        <Typography variant="body2" color={tokens.text.secondary}>
          {row.field_rango_vacaciones.end}
        </Typography>
      ),
    },
    {
      key: 'days',
      label: 'Días',
      align: 'center',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: tokens.text.body, textAlign: 'center' }}>
          {calculateBusinessDays(
            row.field_rango_vacaciones.start,
            row.field_rango_vacaciones.end,
          )}
        </Typography>
      ),
    },
    {
      key: 'field_estado',
      label: 'Estado',
      render: (row) => <VacationStatusChip status={row.field_estado} />,
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right',
      render: (row) =>
        row.field_estado === 'Pending' ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              startIcon={<CheckCircleIcon fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(row, 'Approved');
              }}
              aria-label={`Aprobar solicitud de ${row.field_solicitante}`}
              sx={{
                color: tokens.status.approvedText,
                bgcolor: tokens.status.approvedBg,
                border: `1px solid #bbf7d0`,
                fontWeight: 500,
                borderRadius: 1,
                '&:hover': { bgcolor: '#dcfce7', borderColor: '#86efac' },
              }}
            >
              Aprobar
            </Button>
            <Button
              size="small"
              startIcon={<CancelIcon fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(row, 'Rejected');
              }}
              aria-label={`Rechazar solicitud de ${row.field_solicitante}`}
              sx={{
                color: tokens.status.rejectedText,
                bgcolor: tokens.status.rejectedBg,
                border: `1px solid #fecaca`,
                fontWeight: 500,
                borderRadius: 1,
                '&:hover': { bgcolor: '#fee2e2', borderColor: '#fca5a5' },
              }}
            >
              Rechazar
            </Button>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: tokens.text.muted, fontStyle: 'italic', textAlign: 'right' }}
          >
            Resuelta
          </Typography>
        ),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageContainer>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h1">Gestión de Vacaciones</Typography>
      </Box>

      {/* Filter tabs */}
      <Box
        component="nav"
        aria-label="Filtrar solicitudes"
        sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}
      >
        {(['Pending', 'Resolved', 'All'] as const).map((status) => {
          const active = filterStatus === status;
          return (
            <Button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              aria-pressed={active}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '24px',
                bgcolor: active ? tokens.text.heading : tokens.chip.neutralBg,
                color: active ? '#ffffff' : tokens.text.secondary,
                '&:hover': {
                  bgcolor: active ? tokens.text.body : tokens.border.default,
                },
              }}
            >
              {FILTER_LABELS[status]}
            </Button>
          );
        })}
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Cargando solicitudes…</Typography>
        </Box>
      ) : (
        <DataTable<Vacation>
          columns={columns}
          rows={paginatedRequests}
          ariaLabel="Tabla de solicitudes de vacaciones"
          emptyMessage={
            filterStatus === 'Pending'
              ? '¡Genial! No hay solicitudes pendientes.'
              : 'No hay solicitudes para mostrar.'
          }
          pagination={
            totalPages > 1
              ? { currentPage, totalPages, onPageChange: setCurrentPage }
              : undefined
          }
        />
      )}

      {/* Confirmation dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 700 }}>
          {actionType === 'Approved' ? '¿Aprobar vacaciones?' : '¿Rechazar vacaciones?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === 'Approved'
              ? 'Esta acción aprobará la solicitud y disparará el proceso de recálculo de asignaciones. ¿Estás seguro?'
              : 'Esta acción rechazará la solicitud del empleado de forma definitiva.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: tokens.text.secondary }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              bgcolor:
                actionType === 'Approved'
                  ? tokens.status.approvedText
                  : tokens.status.rejectedText,
              '&:hover': {
                bgcolor:
                  actionType === 'Approved' ? '#166534' : '#991b1b',
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success snackbar */}
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
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
