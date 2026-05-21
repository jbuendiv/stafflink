import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { tokens } from '@/app/providers/styles/theme';
import type { SvgIconComponent } from '@mui/icons-material';

export interface EmptyStateProps {
  /** Main heading */
  title?: string;
  /** Descriptive body text */
  description?: string;
  /** Override the default InboxIcon with any MUI SvgIcon */
  icon?: SvgIconComponent;
  /** Label for the optional CTA button */
  actionLabel?: string;
  /** Click handler for the CTA button */
  onAction?: () => void;
}

/**
 * EmptyState
 *
 * Renders a centred, accessible empty-state placeholder.
 * Used in tables and lists when there is no data to show.
 *
 * @example
 * <EmptyState
 *   title="No hay proyectos"
 *   description="Crea el primero haciendo clic en el botón."
 *   actionLabel="Nuevo proyecto"
 *   onAction={() => setOpen(true)}
 * />
 */
export function EmptyState({
  title = 'No hay datos',
  description,
  icon: Icon = InboxIcon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Icon
        aria-hidden="true"
        sx={{
          fontSize: 56,
          color: tokens.text.muted,
          mb: 0.5,
        }}
      />

      <Typography
        component="p"
        sx={{
          fontSize: tokens.fontSize.md,
          fontWeight: tokens.fontWeight.semibold,
          color: tokens.text.heading,
          m: 0,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          component="p"
          sx={{
            fontSize: tokens.fontSize.base,
            color: tokens.text.secondary,
            maxWidth: '40ch',
            m: 0,
            lineHeight: tokens.lineHeight.normal,
          }}
        >
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ mt: 1 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
