import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CLIENT_MANAGERS } from '../../../data/mockData';
import { Client } from '../../../types';
import { clienteService } from '@/entities/cliente/api/cliente-service';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SearchIcon from '@mui/icons-material/Search';

import {
  PageContainer,
  PageHeader,
  FilterPanel,
  DataTable,
  ResultsCount,
} from '@/shared/ui';
import type { Column } from '@/shared/ui';
import { tokens } from '@/app/providers/styles/theme';

const ITEMS_PER_PAGE = 8;

export function ClientsView() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(clienteService.getAll());
  }, []);

  // Input (draft) state
  const [inputSearch, setInputSearch]     = useState('');
  const [inputLevel, setInputLevel]       = useState<number | ''>('');
  const [inputSector, setInputSector]     = useState('');
  const [inputManager, setInputManager]   = useState('');

  // Applied filter state
  const [search, setSearch]       = useState('');
  const [level, setLevel]         = useState<number | ''>('');
  const [sector, setSector]       = useState('');
  const [manager, setManager]     = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const levels   = useMemo(() => Array.from(new Set(clients.map((c) => c.level).filter(Boolean))), [clients]);
  const sectors  = useMemo(() => Array.from(new Set(clients.map((c) => c.sector).filter(Boolean))), [clients]);
  const managers = useMemo(() => MOCK_CLIENT_MANAGERS, []);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filteredClients = useMemo(() =>
    clients.filter((c) => {
      const matchSearch  = !search  || c.name.toLowerCase().includes(search.toLowerCase());
      const matchLevel   = level === '' || c.level === level;
      const matchSector  = !sector  || c.sector === sector;
      const matchManager = !manager || c.manager?.id === manager;
      return matchSearch && matchLevel && matchSector && matchManager;
    }),
    [clients, search, level, sector, manager],
  );

  const totalPages      = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setSearch(inputSearch);
    setLevel(inputLevel);
    setSector(inputSector);
    setManager(inputManager);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setInputSearch(''); setInputLevel(''); setInputSector(''); setInputManager('');
    setSearch('');     setLevel('');      setSector('');      setManager('');
    setCurrentPage(1);
  };

  // ── Column definitions ────────────────────────────────────────────────────────
  const columns: Column<Client>[] = [
    {
      key: 'name',
      label: 'Nombre de Cliente',
      render: (row) => (
        <Typography component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {row.name}
        </Typography>
      ),
    },
    {
      key: 'level',
      label: 'Nivel',
      render: (row) =>
        row.level ? (
          <Chip
            label={row.level}
            size="small"
            sx={{
              bgcolor: tokens.surface.hover,
              color: tokens.text.body,
              fontWeight: 500,
              borderRadius: '4px',
            }}
          />
        ) : (
          <Typography component="span" color="text.secondary">—</Typography>
        ),
    },
    {
      key: 'sector',
      label: 'Sector',
      render: (row) => (
        <Typography component="span" color="text.secondary">
          {row.sector || '—'}
        </Typography>
      ),
    },
    {
      key: 'manager',
      label: 'Cliente Manager',
      render: (row) =>
        row.manager ? (
          <Chip
            label={row.manager.name}
            size="small"
            sx={{
              bgcolor: tokens.status.plannedBg,
              color: tokens.brand.main,
              fontWeight: 500,
              borderRadius: '4px',
            }}
          />
        ) : (
          <Typography component="span" color="text.secondary">—</Typography>
        ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Clientes"
        actionLabel="Nuevo Cliente"
        actionIcon={<AddBusinessIcon />}
        onAction={() => navigate('/clients/create')}
      />

      <FilterPanel onSearch={handleApplyFilters} onClear={handleClearFilters}>
        <TextField
          size="small"
          label="Nombre del Cliente"
          placeholder="Buscar..."
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
          slotProps={{ input: { startAdornment: <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} /> } }}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="level-label">Todos los niveles</InputLabel>
          <Select
            labelId="level-label"
            value={inputLevel}
            label="Todos los niveles"
            onChange={(e) => setInputLevel(e.target.value as number | '')}
          >
            <MenuItem value="">Todos los niveles</MenuItem>
            {levels.map((l) => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          size="small"
          sx={{ minWidth: 180 }}
          options={sectors}
          value={inputSector || null}
          onChange={(_, val) => setInputSector(val ?? '')}
          renderInput={(params) => <TextField {...params} label="Todos los Sectores" />}
        />

        <Autocomplete
          size="small"
          sx={{ minWidth: 200 }}
          options={managers}
          getOptionLabel={(o) => o.name}
          value={managers.find((m) => m.id === inputManager) ?? null}
          onChange={(_, val) => setInputManager(val?.id ?? '')}
          renderInput={(params) => <TextField {...params} label="Todos los Managers" />}
        />
      </FilterPanel>

      <ResultsCount
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredClients.length}
      />

      <DataTable<Client>
        ariaLabel="Tabla de clientes"
        emptyMessage="No se encontraron clientes con los filtros aplicados."
        columns={columns}
        rows={paginatedClients}
        onRowClick={(c) => navigate(`/clients/${c.id}`)}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />
    </PageContainer>
  );
}
