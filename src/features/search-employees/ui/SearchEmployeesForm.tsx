import { Box, TextField, Typography, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { SearchCriteria } from '../lib/search-filters';
import { MultiSelectField } from '@/shared/ui/form-components/MultiSelectField';
import { SearchableMultiSelectField } from '@/shared/ui/form-components/SearchableMultiSelectField';
import { SelectField } from '@/shared/ui/form-components/SelectField';
import { mockCatalogs } from '@/shared/mock/catalogs';
import { employees as mockEmployees } from '@/entities/employee/model/employee-mock';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface SearchEmployeesFormProps {
  criteria: SearchCriteria;
  onCriteriaChange: (updates: Partial<SearchCriteria>) => void;
  onReset: () => void;
  onSearch: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export function SearchEmployeesForm({
  criteria,
  onCriteriaChange,
  onReset,
  onSearch,
  startDate,
  endDate,
  onDateRangeChange,
}: SearchEmployeesFormProps) {
  
  // Extract responsables for dropdown
  const responsablesOptions = mockEmployees
    .filter(emp => emp.roles.includes('RESPONSABLE') || emp.roles.includes('RESPONSABLE_STAFFING'))
    .map(emp => ({ id: emp.id, label: `${emp.name} ${emp.surname}` }));

  return (
    <Box sx={{ border: '1px solid #e5e7eb', borderRadius: 3, overflow: 'hidden', bgcolor: 'white', mb: 3, p: 3 }}>
      <Box component="form" noValidate autoComplete="off">
        <Stack spacing={3}>
          {/* Fila 1 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              size="small"
              fullWidth
              label="Nombre o número de empleado"
              placeholder="Escribe el nombre o cod..."
              value={criteria.searchText || ''}
              onChange={(e) => onCriteriaChange({ searchText: e.target.value })}
            />
            
            <SelectField
              size="small"
              label="Departamento"
              value={criteria.department || ''}
              onChange={(value) => onCriteriaChange({ department: value || undefined })}
              options={mockCatalogs.departments.map((d) => ({ id: d.id, nombre: d.value }))}
            />
          </Box>

          {/* Fila 2 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SelectField
              size="small"
              label="Área"
              value={criteria.area || ''}
              onChange={(value) => onCriteriaChange({ area: value || undefined })}
              options={mockCatalogs.areas.map((a) => ({ id: a.id, nombre: a.value }))}
            />

            <SelectField
              size="small"
              label="Oficina"
              value={criteria.oficina || ''}
              onChange={(value) => onCriteriaChange({ oficina: value || undefined })}
              options={mockCatalogs.oficinas.map((o) => ({ id: o.id, nombre: o.value }))}
            />
          </Box>
          
          {/* Fila 3 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SearchableMultiSelectField
              size="small"
              label="Responsables"
              value={criteria.responsables || []}
              onChange={(value) => onCriteriaChange({ responsables: value })}
              options={responsablesOptions}
              placeholder="Buscar responsable..."
            />
            
            {/* mock options for projects/opportunities */}
            <SelectField
              size="small"
              label="Proyectos u oportunidades"
              value={criteria.proyectosOportunidades?.[0] || ''}
              onChange={(value) => onCriteriaChange({ proyectosOportunidades: value ? [value] : undefined })}
              options={[
                { id: '1', nombre: 'Proyecto Alpha' },
                { id: '2', nombre: 'Oportunidad Beta' },
              ]}
            />
          </Box>

          {/* Fila 4 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SelectField
              size="small"
              label="Categoría"
              value={criteria.categoria || ''}
              onChange={(value) => onCriteriaChange({ categoria: value || undefined })}
              options={mockCatalogs.categorias.map((c) => ({ id: c.id, nombre: c.value }))}
            />

            <SelectField
              size="small"
              label="Tipo de Carrera"
              value={criteria.tipoCarrera || ''}
              onChange={(value) => onCriteriaChange({ tipoCarrera: value || undefined })}
              options={mockCatalogs.tipos_carrera.map((t) => ({ id: t.id, nombre: t.value }))}
            />
          </Box>

          {/* Fila 5 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SelectField
              size="small"
              label="División"
              value={criteria.division || ''}
              onChange={(value) => onCriteriaChange({ division: value || undefined })}
              options={mockCatalogs.divisions.map((d) => ({ id: d.id, nombre: d.value }))}
            />
            
            <SearchableMultiSelectField
              size="small"
              label="Idiomas"
              value={criteria.idiomas || []}
              onChange={(value) => onCriteriaChange({ idiomas: value })}
              options={mockCatalogs.idiomas.map((i) => ({ id: i.id, label: i.value }))}
              placeholder="Buscar idiomas..."
            />
          </Box>

          {/* Fila 6 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SearchableMultiSelectField
              size="small"
              label="Skills"
              value={criteria.skills || []}
              onChange={(value) => onCriteriaChange({ skills: value })}
              options={mockCatalogs.skills.map((s) => ({ id: s.id, label: s.value }))}
              placeholder="Buscar skills..."
            />
            
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>Disponibilidad</Typography>
              <ToggleButtonGroup
                value={criteria.disponibilidadMeses || []}
                onChange={(e, newMonths) => onCriteriaChange({ disponibilidadMeses: newMonths })}
                aria-label="Meses de disponibilidad"
                size="small"
                fullWidth
              >
                <ToggleButton value="Abril" aria-label="Abril">Abril</ToggleButton>
                <ToggleButton value="Mayo" aria-label="Mayo">Mayo</ToggleButton>
                <ToggleButton value="Junio" aria-label="Junio">Junio</ToggleButton>
                <ToggleButton value="Julio" aria-label="Julio">Julio</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="text" 
              color="inherit" 
              startIcon={<ClearIcon />}
              onClick={onReset}
              sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'bold' }}
            >
              Limpiar filtros
            </Button>
            <Button 
              variant="contained" 
              onClick={onSearch}
              sx={{ 
                bgcolor: '#1a56db', 
                borderRadius: '24px', 
                px: 4, 
                textTransform: 'none', 
                fontWeight: 'bold', 
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1e3a8a', boxShadow: 'none' } 
              }}
            >
              Buscar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
