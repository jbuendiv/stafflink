import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  type DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '@/app/providers/styles/theme';

export interface BaseModalProps extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Content for the DialogActions footer (buttons, etc.) */
  actions?: React.ReactNode;
  /** Called when the user closes the dialog */
  onClose: () => void;
  /** Whether the dialog is in a loading/submitting state (disables close) */
  loading?: boolean;
}

/**
 * BaseModal
 *
 * A single, consistent modal shell used by all feature dialogs.
 * Provides: accessible title, close button, scrollable content area,
 * sticky footer for actions, and tokens-based styling.
 *
 * @example
 * <BaseModal open={open} onClose={handleClose} title="Edit Project" actions={<Button>Save</Button>}>
 *   <ProjectForm />
 * </BaseModal>
 */
export function BaseModal({
  title,
  subtitle,
  actions,
  onClose,
  loading = false,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  ...rest
}: BaseModalProps) {
  return (
    <Dialog
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="base-modal-title"
      {...rest}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.modal,
          overflow: 'hidden',
        },
        ...rest.sx,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <DialogTitle
        id="base-modal-title"
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          pt: 3,
          pb: subtitle ? 0.5 : 2,
          borderBottom: subtitle ? 'none' : `1px solid ${tokens.border.default}`,
        }}
      >
        <div>
          <Typography
            component="h2"
            sx={{
              fontSize: tokens.fontSize.xl,
              fontWeight: tokens.fontWeight.semibold,
              color: tokens.text.heading,
              lineHeight: tokens.lineHeight.tight,
              m: 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              component="p"
              sx={{
                mt: 0.5,
                fontSize: tokens.fontSize.sm,
                color: tokens.text.secondary,
                m: 0,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </div>

        <IconButton
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar diálogo"
          size="small"
          sx={{
            flexShrink: 0,
            color: tokens.text.secondary,
            '&:hover': { color: tokens.text.body },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {subtitle && (
        <div
          style={{
            height: '1px',
            background: tokens.border.default,
            margin: '0 24px 8px',
          }}
        />
      )}

      {/* ── Body ───────────────────────────────────────────────────── */}
      <DialogContent
        sx={{
          px: 3,
          py: 2,
          overflowY: 'auto',
        }}
      >
        {children}
      </DialogContent>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      {actions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
            borderTop: `1px solid ${tokens.border.default}`,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
