import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { tokens } from '@/app/providers/styles/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageAction {
  /** Button label text */
  label: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** 'contained' (default) | 'outlined' */
  variant?: 'contained' | 'outlined';
}

interface PageHeaderProps {
  /** Page title shown on the left */
  title: string;

  /**
   * Array of action buttons rendered on the right.
   * First item = leftmost button (secondary / outlined).
   * Last  item = rightmost button (primary / contained).
   *
   * Backward-compat single-action props are still supported.
   */
  actions?: PageAction[];

  // ── Legacy single-action props (kept for backward compatibility) ──────────
  /** @deprecated Use `actions` instead */
  actionLabel?: string;
  /** @deprecated Use `actions` instead */
  actionIcon?: React.ReactNode;
  /** @deprecated Use `actions` instead */
  onAction?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Shared page header: responsive title on the left, optional action buttons on
 * the right.  Supports both the legacy single-action API and the new multi-
 * action `actions` array.
 */
export function PageHeader({
  title,
  actions,
  // legacy props
  actionLabel,
  actionIcon,
  onAction,
}: PageHeaderProps) {
  // Normalise to a unified actions array
  const resolvedActions: PageAction[] =
    actions ??
    (actionLabel && onAction
      ? [{ label: actionLabel, icon: actionIcon, onClick: onAction, variant: 'contained' }]
      : []);

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          color: tokens.text.heading,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
        }}
      >
        {title}
      </Typography>

      {resolvedActions.length > 0 && (
        <Box
          sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}
          role="group"
          aria-label="Acciones de página"
        >
          {resolvedActions.map((action) => {
            const isContained =
              action.variant === 'contained' || action.variant === undefined;

            return (
              <Button
                key={action.label}
                variant={action.variant ?? 'contained'}
                startIcon={action.icon}
                onClick={action.onClick}
                sx={
                  isContained
                    ? {
                        bgcolor: tokens.brand.main,
                        '&:hover': { bgcolor: tokens.brand.dark },
                      }
                    : {
                        borderColor: tokens.brand.main,
                        color: tokens.brand.main,
                        '&:hover': {
                          borderColor: tokens.brand.dark,
                          bgcolor: tokens.surface.hover,
                        },
                      }
                }
              >
                {action.label}
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
