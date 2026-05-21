import { createTheme } from '@mui/material/styles';

// ─── Design tokens (import these instead of hardcoding hex values) ────────────
export const tokens = {
  // ── Brand colours ──────────────────────────────────────────────────────────
  brand: {
    main:  '#1a56db',
    dark:  '#1e3a8a',
    light: '#3f83f8',
  },

  // ── Border ─────────────────────────────────────────────────────────────────
  border: {
    default: '#e5e7eb',
    strong:  '#d1d5db',
    focus:   '#1a56db',
  },

  // ── Surface / background ───────────────────────────────────────────────────
  surface: {
    page:    '#f9fafb',
    card:    '#ffffff',
    hover:   'rgba(26, 86, 219, 0.04)',
    overlay: 'rgba(0, 0, 0, 0.45)',
  },

  // ── Text ───────────────────────────────────────────────────────────────────
  text: {
    heading:   '#111827',
    body:      '#374151',
    secondary: '#6b7280',
    muted:     '#9ca3af',
    onBrand:   '#ffffff',
    link:      '#1a56db',
    linkHover: '#1e3a8a',
  },

  // ── Semantic status ────────────────────────────────────────────────────────
  status: {
    completedBg:    '#dcfce7',
    completedText:  '#166534',
    inProgressBg:   '#dbeafe',
    inProgressText: '#1e40af',
    plannedBg:      '#f3f4f6',
    plannedText:    '#4b5563',
    pendingBg:      '#fef3c7',
    pendingText:    '#b45309',
    approvedBg:     '#dcfce7',
    approvedText:   '#15803d',
    rejectedBg:     '#fee2e2',
    rejectedText:   '#b91c1c',
    warningBg:      '#fef9c3',
    warningText:    '#854d0e',
    errorBg:        '#fee2e2',
    errorText:      '#b91c1c',
  },

  // ── Chip ───────────────────────────────────────────────────────────────────
  chip: {
    neutralBg:   '#f3f4f6',
    neutralText: '#1f2937',
    accentBg:    '#eef2ff',
    accentText:  '#1a56db',
    infoBg:      '#dbeafe',
    infoText:    '#1e40af',
  },

  // ── Table ──────────────────────────────────────────────────────────────────
  table: {
    headerBg:   '#f8fafc',
    headerText: '#475569',
    border:     '#e2e8f0',
    rowHover:   'rgba(26, 86, 219, 0.04)',
    focusColor: '#1a56db',
  },

  // ── Border radii ───────────────────────────────────────────────────────────
  radius: {
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    pill: '9999px',
  },

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadow: {
    xs:    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm:    '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
    md:    '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
    lg:    '0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.10)',
  },

  // ── Typography scale ───────────────────────────────────────────────────────
  fontSize: {
    xs:   '0.75rem',   // 12px
    sm:   '0.8125rem', // 13px
    base: '0.875rem',  // 14px
    md:   '1rem',      // 16px
    lg:   '1.125rem',  // 18px
    xl:   '1.25rem',   // 20px
    '2xl':'1.5rem',    // 24px
    '3xl':'1.875rem',  // 30px
  },
  fontWeight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  lineHeight: {
    tight:  1.25,
    normal: 1.5,
    relaxed:1.75,
  },

  // ── Animation ──────────────────────────────────────────────────────────────
  animation: {
    durationFast:   '100ms',
    durationBase:   '200ms',
    durationSlow:   '300ms',
    easing:         'cubic-bezier(0.4, 0, 0.2, 1)',
    easingEnter:    'cubic-bezier(0, 0, 0.2, 1)',
    easingExit:     'cubic-bezier(0.4, 0, 1, 1)',
  },

  // ── Spacing / layout ───────────────────────────────────────────────────────
  spacing: {
    pageMaxWidth:  '1200px',
    pageTopMargin: 4,
    pagePadding:   { xs: 2, sm: 3, md: 4 },
    sectionGap:    4,
    cardPadding:   3,
  },
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a56db', 
      light: '#3f83f8',
      dark: '#1e429f',
    },
    secondary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#22c55e',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1e293b',
    },
    h2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: '#1e293b',
    },
    h3: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#1e293b',
    },
    h4: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e293b',
    },
    h5: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e293b',
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1e293b',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#334155',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#334155',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#64748b',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',   // 15 px – unified across all sizes
          borderRadius: 24,
          boxShadow: 'none',
          lineHeight: 1.5,
          '&:hover': {
            boxShadow: 'none',
          },
        },
        // Every "medium" button (the default) gets the same comfortable padding
        sizeMedium: {
          padding: '10px 24px',
        },
        sizeLarge: {
          fontSize: '1rem',
          padding: '12px 28px',
        },
        sizeSmall: {
          fontSize: '0.8125rem',
          padding: '6px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '0.875rem',
          fontWeight: 600, 
          color: '#475569', 
          backgroundColor: '#f8fafc', 
          borderBottom: '2px solid #e2e8f0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        body: {
          fontSize: '0.875rem',
          fontWeight: 400,
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.border.default}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: 'none',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&[tabindex]': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: tokens.surface.hover,
            },
            '&:focus': {
              outline: `2px solid ${tokens.brand.main}`,
              outlineOffset: '-2px',
            },
            '&:focus-visible': {
              outline: `2px solid ${tokens.brand.main}`,
              outlineOffset: '-2px',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
});
