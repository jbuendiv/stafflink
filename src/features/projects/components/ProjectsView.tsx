import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIENT_MANAGERS, MOCK_CLIENTS } from '../../../data/mockData';
import { Project } from '../../../types';
import { proyectoService } from '@/entities/proyecto/api/proyecto-service';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

import AccountTreeIcon from '@mui/icons-material/AccountTree';

import {
  PageContainer,
  PageHeader,
  FilterPanel,
  DataTable,
  ResultsCount,
  StatusChip,
} from '@/shared/ui';
import type { Column } from '@/shared/ui';

const ITEMS_PER_PAGE = 8;
const ESTADOS = ['Planned', 'In Progress', 'Completed'];

export function ProjectsView() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(proyectoService.getAll());
  }, []);

  // Input (draft) state — not yet applied
  const [inputSearch, setInputSearch] = useState('');
  const [inputCliente, setInputCliente] = useState('');
  const [inputEstado, setInputEstado] = useState('');

  // Applied filter state
  const [search, setSearch] = useState('');
  const [cliente, setCliente] = useState('');
  const [estado, setEstado] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const managers = useMemo(() => MOCK_CLIENT_MANAGERS, []);
  const clients = useMemo(() => MOCK_CLIENTS, []);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filteredProjects = useMemo(() =>
    projects.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.codigoProyecto.toLowerCase().includes(search.toLowerCase());
      const matchCliente = !cliente || p.clientId === cliente;
      const matchEstado = !estado || p.estado === estado;
      return matchSearch && matchCliente && matchEstado;
    }),
    [projects, search, cliente, estado],
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setSearch(inputSearch);
    setCliente(inputCliente);
    setEstado(inputEstado);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setInputSearch('');
    setInputCliente('');
    setInputEstado('');
    setSearch('');
    setCliente('');
    setEstado('');
    setCurrentPage(1);
  };

  // ── Column definitions ────────────────────────────────────────────────────────
  const columns: Column<Project>[] = [
    {
      key: 'codigoProyecto',
      label: 'Cód. Proyecto',
      render: (row) => (
        <Typography component="span" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
          {row.codigoProyecto}
        </Typography>
      ),
    },
    {
      key: 'name',
      label: 'Nombre de Proyecto',
      render: (row) => (
        <Typography component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {row.name}
        </Typography>
      ),
    },
    {
      key: 'clientName',
      label: 'Cliente',
    },
    {
      key: 'technicalLeadId',
      label: 'Technical Lead',
      render: (row) => (
        <span>{managers.find((m) => m.id === row.technicalLeadId)?.name ?? '—'}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusChip status={row.estado} />,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Proyectos"
        actionLabel="Nuevo Proyecto"
        actionIcon={<AccountTreeIcon />}
        onAction={() => navigate('/projects/create')}
      />

      <FilterPanel onSearch={handleApplyFilters} onClear={handleClearFilters}>
        <TextField
          size="small"
          label="Buscar por nombre o código"
          placeholder="Buscar..."
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <Autocomplete
          size="small"
          sx={{ minWidth: 200 }}
          options={clients}
          getOptionLabel={(o) => o.name}
          value={clients.find((c) => c.id === inputCliente) ?? null}
          onChange={(_, val) => setInputCliente(val?.id ?? '')}
          renderInput={(params) => <TextField {...params} label="Todos los Clientes" />}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="estado-label">Todos los Estados</InputLabel>
          <Select
            labelId="estado-label"
            value={inputEstado}
            label="Todos los Estados"
            onChange={(e) => setInputEstado(e.target.value)}
          >
            <MenuItem value="">Todos los Estados</MenuItem>
            {ESTADOS.map((est) => (
              <MenuItem key={est} value={est}>{est}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterPanel>

      <ResultsCount
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredProjects.length}
      />

      <DataTable<Project>
        ariaLabel="Tabla de proyectos"
        emptyMessage="No se encontraron proyectos con los filtros aplicados."
        columns={columns}
        rows={paginatedProjects}
        onRowClick={(p) => navigate(`/projects/${p.id}`)}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />
    </PageContainer>
  );
}
