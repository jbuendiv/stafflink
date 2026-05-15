import { Box, TextField, Typography, Button, Paper, Stack } from '@mui/material';
import type { SearchCriteria } from '../lib/search-filters';
import { MultiSelectField } from '@/shared/ui/form-components/MultiSelectField';
import { SearchableMultiSelectField } from '@/shared/ui/form-components/SearchableMultiSelectField';
import { SelectField } from '@/shared/ui/form-components/SelectField';
import { mockCatalogs } from '@/shared/mock/catalogs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface SearchEmployeesFormProps {
  criteria: SearchCriteria;
  onCriteriaChange: (updates: Partial<SearchCriteria>) => void;
  onReset: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export function SearchEmployeesForm({
  criteria,
  onCriteriaChange,
  onReset,
  startDate,
  endDate,
  onDateRangeChange,
}: SearchEmployeesFormProps) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontSize: '1.5em' }}>
        Filtros de busqueda
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <Stack spacing={3}>
          {/* Búsqueda por nombre y horas libres */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Buscar por nombre"
              placeholder="Nombre del empleado..."
              value={criteria.searchText || ''}
              onChange={(e) => onCriteriaChange({ searchText: e.target.value })}
            />

            <TextField
              fullWidth
              label="Horas libres mínimas"
              type="number"
              value={criteria.minimumAvailability || 0}
              onChange={(e) =>
                onCriteriaChange({ minimumAvailability: Number(e.target.value) })
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 168,
                  step: 1,
                },
              }}
            />
          </Box>

          {/* Skills e Idiomas */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SearchableMultiSelectField
              label="Skills"
              value={criteria.skills || []}
              onChange={(value) => onCriteriaChange({ skills: value })}
              options={mockCatalogs.skills.map((s) => ({ id: s.id, label: s.value }))}
              placeholder="Buscar skills..."
            />

            <SearchableMultiSelectField
              label="Idiomas"
              value={criteria.idiomas || []}
              onChange={(value) => onCriteriaChange({ idiomas: value })}
              options={mockCatalogs.idiomas.map((i) => ({ id: i.id, label: i.value }))}
              placeholder="Buscar idiomas..."
            />
          </Box>

          {/* Categoría y Tipo de Carrera */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <MultiSelectField
              label="Categoría"
              value={criteria.categoria || []}
              onChange={(value) => onCriteriaChange({ categoria: value })}
              options={mockCatalogs.categorias.map((c) => ({ id: c.id, label: c.value }))}
            />

            <SelectField
              label="Tipo de Carrera"
              value={criteria.tipoCarrera || ''}
              onChange={(value) =>
                onCriteriaChange({ tipoCarrera: value || undefined })
              }
              options={mockCatalogs.tipos_carrera.map((t) => ({ id: t.id, nombre: t.value }))}
            />
          </Box>

          {/* Área y Oficina */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <SelectField
              label="Área"
              value={criteria.area || ''}
              onChange={(value) => onCriteriaChange({ area: value || undefined })}
              options={mockCatalogs.areas.map((a) => ({ id: a.id, nombre: a.value }))}
            />

            <SelectField
              label="Oficina"
              value={criteria.oficina || ''}
              onChange={(value) => onCriteriaChange({ oficina: value || undefined })}
              options={mockCatalogs.oficinas.map((o) => ({ id: o.id, nombre: o.value }))}
            />
          </Box>

          {/* Rango de fechas */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha inicio"
                value={startDate}
                onChange={(date: Date | null) => onDateRangeChange(date, endDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha fin"
                value={endDate}
                onChange={(date: Date | null) => onDateRangeChange(startDate, date)}
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* Botón de reset */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={onReset}
              sx={{ 
                px: 3, 
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
