import React from 'react';
import Chip from '@mui/material/Chip';
import { tokens } from '@/app/providers/styles/theme';

type Status = 'Completed' | 'In Progress' | 'Planned' | string;

interface StatusChipProps {
  status: Status;
  /** Optional label override; defaults to the status value itself */
  label?: string;
}

const STATUS_STYLES: Record<string, { bgcolor: string; color: string }> = {
  Completed:   { bgcolor: tokens.status.completedBg,   color: tokens.status.completedText },
  'In Progress':{ bgcolor: tokens.status.inProgressBg, color: tokens.status.inProgressText },
  Planned:     { bgcolor: tokens.status.plannedBg,     color: tokens.status.plannedText },
};

const DEFAULT_STYLE = { bgcolor: tokens.status.plannedBg, color: tokens.status.plannedText };

/**
 * Displays a project/task status as a coloured, rounded chip.
 */
export function StatusChip({ status, label }: StatusChipProps) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STYLE;

  return (
    <Chip
      label={label ?? status}
      size="small"
      sx={{
        ...style,
        fontWeight: 500,
        borderRadius: '4px',
      }}
    />
  );
}
