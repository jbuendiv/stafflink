import React, { useState, useMemo } from 'react';
import { Pagination } from '../../../components/common/Pagination';
import { ClientModal } from './ClientModal';
import { MOCK_CLIENTS, MOCK_CLIENT_MANAGERS } from '../../../data/mockData';
import { Client } from '../../../types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';

const ITEMS_PER_PAGE = 8;

export function ClientsView() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | ''>('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Derive unique values for selects
  const levels = useMemo(() => Array.from(new Set(clients.map(c => c.level).filter(Boolean))), [clients]);
  const sectors = useMemo(() => Array.from(new Set(clients.map(c => c.sector).filter(Boolean))), [clients]);
  const managers = useMemo(() => MOCK_CLIENT_MANAGERS, []);

  // Filtering logic
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLevel = levelFilter === '' || client.level === levelFilter;
      const matchSector = sectorFilter === '' || client.sector === sectorFilter;
      const matchManager = managerFilter === '' || 
        (client.manager && client.manager.id === managerFilter);

      return matchSearch && matchLevel && matchSector && matchManager;
    });
  }, [clients, searchTerm, levelFilter, sectorFilter, managerFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setLevelFilter('');
    setSectorFilter('');
    setManagerFilter('');
    setCurrentPage(1);
  };

  const handleOpenModal = (client: Client | null = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = (savedClient: Client) => {
    setClients(prev => {
      const exists = prev.find(c => c.id === savedClient.id);
      if (exists) {
        return prev.map(c => c.id === savedClient.id ? savedClient : c);
      } else {
        return [savedClient, ...prev];
      }
    });
  };

  const resetPage = () => setCurrentPage(1);

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Gestión de Clientes
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddBusinessIcon />}
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
          Nuevo Cliente
        </Button>
      </Box>

      {/* Filters Section */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white', mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControl size="small" sx={{ flexGrow: 1, minWidth: 200 }}>
            <TextField
              size="small"
              label="Nombre del Cliente"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
              slotProps={{ input: { startAdornment: <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} /> } }}
            />
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="level-select-label">Todos los niveles</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={levelFilter}
              label="Todos los niveles"
              onChange={(e) => { setLevelFilter(e.target.value as number | ''); resetPage(); }}
            >
              <MenuItem value="">Todos los niveles</MenuItem>
              {levels.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>

          <Autocomplete
            size="small"
            sx={{ minWidth: 200 }}
            options={sectors}
            value={sectorFilter || null}
            onChange={(event, newValue) => { setSectorFilter(newValue || ''); resetPage(); }}
            renderInput={(params) => <TextField {...params} label="Todos los Sectores" />}
          />

          <Autocomplete
            size="small"
            sx={{ minWidth: 200 }}
            options={managers}
            getOptionLabel={(option) => option.name}
            value={managers.find(m => m.id === managerFilter) || null}
            onChange={(event, newValue) => { setManagerFilter(newValue?.id || ''); resetPage(); }}
            renderInput={(params) => <TextField {...params} label="Todos los Clientes Manager" />}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="text" 
            color="inherit" 
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'bold' }}
          >
            Limpiar filtros
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#6366f1', 
              borderRadius: '24px', 
              px: 4, 
              textTransform: 'none', 
              fontWeight: 'bold', 
              boxShadow: 'none',
              '&:hover': { bgcolor: '#4f46e5', boxShadow: 'none' } 
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>

      {/* Results Info */}
      <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: '#6b7280' }}>
        Mostrando {filteredClients.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} de {filteredClients.length} resultados
      </Typography>

      {/* Table Section */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 0.5fr)', p: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Nombre de Cliente</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Nivel</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Sector</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Cliente Manager</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937', textAlign: 'right' }}>Acciones</Typography>
        </Box>
        
        {paginatedClients.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#6b7280' }}>
            No se encontraron clientes con los filtros aplicados.
          </Box>
        ) : (
          paginatedClients.map((client, index) => (
            <Box key={client.id}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(200px, 1.5fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 0.5fr)', 
                  p: 3, 
                  py: 2.5,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 600 }}>{client.name}</Typography>
                <Box>
                  {client.level ? (
                    <Chip 
                      label={client.level}
                      sx={{ 
                        bgcolor: '#f3f4f6', 
                        color: '#1f2937', 
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        borderRadius: 4,
                        height: 'auto',
                        py: 0.5
                      }} 
                    />
                  ) : <Typography sx={{ color: '#6b7280' }}>-</Typography>}
                </Box>
                <Typography sx={{ color: '#6b7280' }}>{client.sector || '-'}</Typography>
                <Box>
                  {client.manager ? (
                    <Chip 
                      label={client.manager.name} 
                      sx={{ 
                        bgcolor: '#eef2ff', 
                        color: '#4f46e5', 
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        borderRadius: 4,
                        height: 'auto',
                        py: 0.5
                      }} 
                    />
                  ) : <Typography sx={{ color: '#6b7280' }}>-</Typography>}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleOpenModal(client)}
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
              {index < paginatedClients.length - 1 && (
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

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={selectedClient}
        allManagers={managers}
        onSave={handleSaveClient}
      />
    </Box>
  );
}
