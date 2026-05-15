import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages === 0) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
      <MuiPagination 
        count={totalPages} 
        page={currentPage} 
        onChange={(event, value) => onPageChange(value)} 
        color="primary" 
        shape="rounded"
      />
    </Box>
  );
}

