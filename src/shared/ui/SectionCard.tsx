import { Box, type BoxProps } from '@mui/material';
import { tokens } from '@/app/providers/styles/theme';

export interface SectionCardProps extends BoxProps {
  /** Remove the default padding (useful when placing a full-width table) */
  noPadding?: boolean;
  /** Visual variant: default card or a subtle flat panel */
  variant?: 'card' | 'flat';
}

/**
 * SectionCard
 *
 * The go-to container for every "panel" inside a page.
 * Replaces the repetitive `Box` with border + borderRadius + bgcolor + padding
 * that appears across all feature views.
 *
 * @example
 * <SectionCard>
 *   <Typography>Content here</Typography>
 * </SectionCard>
 *
 * @example – table without inner padding
 * <SectionCard noPadding>
 *   <DataTable ... />
 * </SectionCard>
 */
export function SectionCard({
  noPadding = false,
  variant = 'card',
  children,
  sx,
  ...rest
}: SectionCardProps) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: tokens.surface.card,
        border: `1px solid ${tokens.border.default}`,
        borderRadius: tokens.radius.lg,
        boxShadow: tokens.shadow.sm,
        overflow: 'hidden',
        ...(noPadding
          ? {}
          : { p: tokens.spacing.cardPadding }),
        ...(variant === 'flat' && {
          boxShadow: 'none',
          bgcolor: tokens.surface.page,
        }),
        // Responsive padding
        ...(noPadding
          ? {}
          : {
              p: {
                xs: 2,
                sm: tokens.spacing.cardPadding,
              },
            }),
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
