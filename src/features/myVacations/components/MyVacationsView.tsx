import React, { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';

import { VacationRequestForm } from './VacationRequestForm';
import { vacacionesService } from '../../../entities/vacaciones/api/vacaciones-service';
import { DataTable, type Column } from '@/shared/ui/DataTable';
import { PageContainer } from '@/shared/ui/PageContainer';
import { tokens } from '@/app/providers/styles/theme';
import type { Vacation } from '../../../entities/vacaciones/model/types';

// ─── Sub-component ────────────────────────────────────────────────────────────

interface VacationStatusChipProps {
  status: Vacation['field_estado'];
}

function VacationStatusChip({ status }: VacationStatusChipProps) {
  if (status === 'Approved') {
    return (
      <Chip
        label="Aprobada"
        size="small"
        sx={{
          bgcolor: tokens.status.approvedBg,
          color: tokens.status.approvedText,
          fontWeight: 600,
          borderRadius: 2,
        }}
      />
    );
  }
  if (status === 'Rejected') {
    return (
      <Chip
        label="Rechazada"
        size="small"
        sx={{
          bgcolor: tokens.status.rejectedBg,
          color: tokens.status.rejectedText,
          fontWeight: 600,
          borderRadius: 2,
        }}
      />
    );
  }
  return (
    <Chip
      label="Pendiente"
      size="small"
      sx={{
        bgcolor: tokens.status.pendingBg,
        color: tokens.status.pendingText,
        fontWeight: 600,
        borderRadius: 2,
      }}
    />
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: Column<Vacation>[] = [
  {
    key: 'start',
    label: 'Fecha Inicio',
    render: (row) => (
      <Typography variant="body2" sx={{ color: tokens.text.body }}>
        {row.field_rango_vacaciones.start}
      </Typography>
    ),
  },
  {
    key: 'end',
    label: 'Fecha Fin',
    render: (row) => (
      <Typography variant="body2" sx={{ color: tokens.text.body }}>
        {row.field_rango_vacaciones.end}
      </Typography>
    ),
  },
  {
    key: 'field_estado',
    label: 'Estado',
    render: (row) => <VacationStatusChip status={row.field_estado} />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function MyVacationsView() {
  const [requests, setRequests] = useState<Vacation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const currentUser = 'user-1';

  const loadRequests = async () => {
    const all = await vacacionesService.getByEmployeeId(currentUser);
    setRequests(all);
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedRequests = useMemo(
    () =>
      [...requests].sort(
        (a, b) =>
          new Date(a.field_rango_vacaciones.start).getTime() -
          new Date(b.field_rango_vacaciones.start).getTime(),
      ),
    [requests],
  );

  const handleSave = async (request: Omit<Vacation, 'id'>) => {
    await vacacionesService.create(request);
    loadRequests();
    setIsFormOpen(false);
  };

  return (
    <PageContainer maxWidth="800px">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h1">Mis Vacaciones</Typography>

        {!isFormOpen && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            aria-label="Solicitar nuevas vacaciones"
            sx={{
              bgcolor: tokens.brand.main,
              borderRadius: '24px',
              px: { xs: 2, md: 4 },
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              '&:hover': { bgcolor: tokens.brand.dark },
            }}
          >
            Solicitar Vacaciones
          </Button>
        )}
      </Box>

      {/* Request form (inline) */}
      {isFormOpen && (
        <Box sx={{ mb: 3 }}>
          <VacationRequestForm
            existingRequests={requests}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
            employeeId={currentUser}
          />
        </Box>
      )}

      {/* Vacation list */}
      <DataTable<Vacation>
        columns={COLUMNS}
        rows={sortedRequests}
        ariaLabel="Tabla de mis solicitudes de vacaciones"
        emptyMessage="No hay vacaciones solicitadas."
      />

      {/* Footer link */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${tokens.border.default}`,
          textAlign: 'center',
        }}
      >
        <Link
          component={RouterLink}
          to="/projects"
          sx={{
            color: tokens.text.secondary,
            textDecoration: 'none',
            fontSize: '0.875rem',
            '&:hover': { color: tokens.text.body },
          }}
        >
          Ver mis proyectos
        </Link>
      </Box>
    </PageContainer>
  );
}
