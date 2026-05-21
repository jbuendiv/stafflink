import React from 'react';
import Typography from '@mui/material/Typography';
import { tokens } from '@/app/providers/styles/theme';

interface ResultsCountProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

/**
 * Displays "Mostrando X a Y de Z resultados".
 * Replaces the repeated inline Typography pattern across all list views.
 */
export function ResultsCount({ currentPage, itemsPerPage, totalItems }: ResultsCountProps) {
  const from = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Typography
      variant="body2"
      aria-live="polite"
      aria-atomic="true"
      sx={{ mb: 2, fontWeight: 500, color: tokens.text.secondary }}
    >
      Mostrando {from} a {to} de {totalItems} resultado{totalItems !== 1 ? 's' : ''}
    </Typography>
  );
}
