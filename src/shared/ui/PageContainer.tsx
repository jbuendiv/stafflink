import React from 'react';
import Box from '@mui/material/Box';
import { tokens } from '@/app/providers/styles/theme';

interface PageContainerProps {
  children: React.ReactNode;
  /** Override maxWidth. Defaults to tokens.spacing.pageMaxWidth (1200px). */
  maxWidth?: string;
}

/**
 * Centering wrapper used by every page-level view.
 * Replaces the repeated `sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}` pattern.
 */
export function PageContainer({ children, maxWidth = tokens.spacing.pageMaxWidth }: PageContainerProps) {
  return (
    <Box
      component="section"
      sx={{
        maxWidth,
        mx: 'auto',
        mt: tokens.spacing.pageTopMargin,
        px: { xs: 2, sm: 3, md: 0 },
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
