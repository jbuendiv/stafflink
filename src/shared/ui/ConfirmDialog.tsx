import {
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { BaseModal } from './BaseModal';
import { tokens } from '@/app/providers/styles/theme';

export interface ConfirmDialogProps {
  open: boolean;
  /** Dialog title */
  title?: string;
  /** Descriptive message asking for confirmation */
  message: React.ReactNode;
  /** Label for the confirm (destructive) button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Visual intent of the confirm button */
  intent?: 'danger' | 'primary';
  /** Whether the confirmation action is loading */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmDialog
 *
 * A reusable confirmation dialog built on top of BaseModal.
 * Covers the common "are you sure?" pattern across all features.
 *
 * @example
 * <ConfirmDialog
 *   open={confirmOpen}
 *   title="Eliminar proyecto"
 *   message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
 *   confirmLabel="Eliminar"
 *   intent="danger"
 *   loading={deleting}
 *   onConfirm={handleDelete}
 *   onCancel={() => setConfirmOpen(false)}
 * />
 */
export function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  intent = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <BaseModal
      open={open}
      onClose={onCancel}
      title={title}
      loading={loading}
      maxWidth="xs"
      actions={
        <>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{ minWidth: 88 }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            color={intent === 'danger' ? 'error' : 'primary'}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
            sx={{ minWidth: 110 }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 0',
          textAlign: 'center',
        }}
      >
        <WarningAmberIcon
          aria-hidden="true"
          sx={{
            fontSize: 48,
            color:
              intent === 'danger'
                ? tokens.status.rejectedText
                : tokens.brand.main,
          }}
        />
        <Typography
          component="p"
          sx={{
            fontSize: tokens.fontSize.base,
            color: tokens.text.body,
            lineHeight: tokens.lineHeight.normal,
            m: 0,
          }}
        >
          {message}
        </Typography>
      </div>
    </BaseModal>
  );
}
