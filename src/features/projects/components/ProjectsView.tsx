import React, { useState, useMemo } from 'react';
import { Pagination } from '../../../components/common/Pagination';
import { ProjectModal } from './ProjectModal';
import { MOCK_PROJECTS, MOCK_CLIENT_MANAGERS, MOCK_CLIENTS } from '../../../data/mockData';
import { Project } from '../../../types';

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
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';

const ITEMS_PER_PAGE = 8;
const ESTADOS = ['Planned', 'In Progress', 'Completed'];

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Deriving lists from mock for selects
  const managers = useMemo(() => MOCK_CLIENT_MANAGERS, []);
  const clients = useMemo(() => MOCK_CLIENTS, []);

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.codigoProyecto.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCliente = clienteFilter === '' || project.clientId === clienteFilter;
      const matchEstado = estadoFilter === '' || project.estado === estadoFilter;

      return matchSearch && matchCliente && matchEstado;
    });
  }, [projects, searchTerm, clienteFilter, estadoFilter]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setClienteFilter('');
    setEstadoFilter('');
    setCurrentPage(1);
  };

  const handleOpenModal = (project: Project | null = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (savedProject: Project) => {
    setProjects(prev => {
      const exists = prev.find(p => p.id === savedProject.id);
      if (exists) {
        return prev.map(p => p.id === savedProject.id ? savedProject : p);
      } else {
        return [savedProject, ...prev];
      }
    });
  };

  const resetPage = () => setCurrentPage(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Planned': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#111827', fontSize: '2.5rem' }}>
          Gestión de Proyectos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AssignmentIcon />}
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
          Nuevo Proyecto
        </Button>
      </Box>

      {/* Filters Section */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white', mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControl size="small" sx={{ flexGrow: 1, minWidth: 200 }}>
            <TextField
              size="small"
              label="Buscar por nombre o código"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
              slotProps={{ input: { startAdornment: <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} /> } }}
            />
          </FormControl>

          <Autocomplete
            size="small"
            sx={{ minWidth: 200 }}
            options={clients}
            getOptionLabel={(option) => option.name}
            value={clients.find(c => c.id === clienteFilter) || null}
            onChange={(event, newValue) => { setClienteFilter(newValue?.id || ''); resetPage(); }}
            renderInput={(params) => <TextField {...params} label="Todos los Clientes" />}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="estado-select-label">Todos los Estados</InputLabel>
            <Select
              labelId="estado-select-label"
              id="estado-select"
              value={estadoFilter}
              label="Todos los Estados"
              onChange={(e) => { setEstadoFilter(e.target.value); resetPage(); }}
            >
              <MenuItem value="">Todos los Estados</MenuItem>
              {ESTADOS.map(est => <MenuItem key={est} value={est}>{est}</MenuItem>)}
            </Select>
          </FormControl>
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
        Mostrando {filteredProjects.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} de {filteredProjects.length} resultados
      </Typography>

      {/* Table Section */}
      <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(100px, 0.5fr)', p: 3, pb: 2 }}>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Cód. Proyecto</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Nombre de Proyecto</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Cliente</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Technical Lead</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937' }}>Estado</Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#1f2937', textAlign: 'right' }}>Acciones</Typography>
        </Box>
        
        {paginatedProjects.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#6b7280' }}>
            No se encontraron proyectos con los filtros aplicados.
          </Box>
        ) : (
          paginatedProjects.map((project, index) => (
            <Box key={project.id}>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(120px, 1fr) minmax(200px, 1.5fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(100px, 0.5fr)', 
                  p: 3, 
                  py: 2.5,
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
                  {project.codigoProyecto}
                </Typography>
                <Typography sx={{ color: '#1f2937', fontSize: '1.1rem', fontWeight: 600 }}>{project.name}</Typography>
                <Typography sx={{ color: '#6b7280' }}>{project.clientName}</Typography>
                <Typography sx={{ color: '#6b7280' }}>
                  {managers.find(m => m.id === project.technicalLeadId)?.name || '-'}
                </Typography>
                <Box>
                  <Chip 
                    label={project.estado} 
                    sx={{ 
                      bgcolor: project.estado === 'Completed' ? '#dcfce7' : project.estado === 'In Progress' ? '#dbeafe' : '#f3f4f6', 
                      color: project.estado === 'Completed' ? '#166534' : project.estado === 'In Progress' ? '#1e40af' : '#4b5563', 
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      borderRadius: 4,
                      px: 1,
                      height: 'auto',
                      py: 0.5
                    }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleOpenModal(project)}
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
              {index < paginatedProjects.length - 1 && (
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        allProjects={projects}
        allManagers={managers}
        allClients={clients}
        onSave={handleSaveProject}
      />
    </Box>
  );
}
