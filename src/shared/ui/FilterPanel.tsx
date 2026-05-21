import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { tokens } from '@/app/providers/styles/theme';

interface FilterPanelProps {
  children: React.ReactNode;
  onSearch: () => void;
  onClear: () => void;
}

/**
 * Shared filter panel: wraps filter controls and renders Search / Clear buttons.
 * Children should be the individual filter inputs (TextField, Select, Autocomplete…).
 */
export function FilterPanel({ children, onSearch, onClear }: FilterPanelProps) {
  return (
    <Box
      component="section"
      aria-label="Filtros de búsqueda"
      sx={{
        border: `1px solid ${tokens.border.default}`,
        borderRadius: 3,
        bgcolor: tokens.surface.card,
        mb: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Filter inputs row */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 2,
        }}
      >
        {children}
      </Box>

      {/* Actions row */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ClearIcon />}
          onClick={onClear}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 'bold' }}
        >
          Limpiar filtros
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{
            bgcolor: tokens.brand.main,
            px: 4,
            '&:hover': { bgcolor: tokens.brand.dark },
          }}
        >
          Buscar
        </Button>
      </Box>
    </Box>
  );
}
