import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul para elementos activos
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#0f766e', // Color accent del proyecto
    },
    background: {
      default: '#f4f1ea',
      paper: '#ffffff',
    },
    text: {
      primary: '#18222b',
      secondary: '#4d5b66',
    },
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    
    // HEADINGS - Sora font para títulos
    h1: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    
    // SUBTÍTULOS - Para labels y encabezados menores
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    
    // BODY TEXT - Manrope para contenido
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    
    // BOTONES
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
      lineHeight: 1.5,
    },
    
    // CAPTION Y OVERLINE
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        sizeLarge: {
          fontSize: '1.125rem',
          padding: '12px 32px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '1.125rem',
          fontWeight: 700, 
          color: '#18222b', 
          backgroundColor: '#f5f5f5', 
          lineHeight: 1.5,
        },
        body: {
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    },
  },
});
