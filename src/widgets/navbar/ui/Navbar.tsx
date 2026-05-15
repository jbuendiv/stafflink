// ============================================================
// IMPORTS
// ============================================================
// Componentes de Material-UI para la interfaz
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  KeyboardArrowDown,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
// Hook personalizado con la lógica del navbar
import { useNavbar } from '../hooks/useNavbar'
// Logo de la aplicación
import logoImg from '@/shared/assets/images/logo.png'

// ============================================================
// TYPES
// ============================================================
// Props del componente Navbar
interface NavbarProps {
  activePage?: string // Página actualmente activa
}

// ============================================================
// CONSTANTS
// ============================================================
// Items del menú desplegable de Empleados (solo para admin/responsable staffing)
const employeesMenuItems = [
  { label: 'Crear Usuarios', value: 'employees-create' },
  { label: 'Filtrar Usuarios', value: 'employees-filter' },
]

// Items del menú desplegable de Area
const areaMenuItems = [
  { label: 'Informes', value: 'informes' },
  { label: 'Piramide', value: 'piramide' },
  { label: 'Vacaciones', value: 'vacaciones' },
  { label: 'Notificacion', value: 'notificacion' },
  { label: 'Taxonomías', value: 'taxonomias' },
]

// ============================================================
// COMPONENT
// ============================================================
export function Navbar({ activePage = 'dashboard' }: NavbarProps) {
  const navigate = useNavigate()
  // TODO: Obtener rol del usuario desde el contexto de autenticación
  // Por ahora usamos un valor mock para demostración
  const userRole = 'administrador' // Valores posibles: 'administrador', 'responsable staffing', 'empleado'
  
  // Verificar si el usuario tiene permisos para gestionar empleados
  const canManageEmployees = ['administrador', 'responsable staffing'].includes(userRole.toLowerCase())
  
  // Hook con lógica de navegación y estado del menú
  const {
    anchorEl,
    employeesAnchorEl,
    isAreaMenuOpen,
    isEmployeesMenuOpen,
    handleAreaMenuOpen,
    handleAreaMenuClose,
    handleEmployeesMenuOpen,
    handleEmployeesMenuClose,
    handleNavClick,
    handleAreaItemClick,
    handleEmployeesItemClick,
    isActiveTab,
  } = useNavbar({ 
    activePage, 
    areaItems: areaMenuItems,
  })

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(24, 34, 43, 0.12)',
        color: '#18222b',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: 64, sm: 70 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* ============================================================ */}
        {/* LOGO */}
        {/* ============================================================ */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            component="img"
            src={logoImg}
            alt="Stafflink Logo"
            sx={{ height: '40px' }}
          />
        </Box>

        {/* ============================================================ */}
        {/* NAVIGATION ITEMS */}
        {/* ============================================================ */}
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            gap: 0.5,
            justifyContent: 'right',
          }}
        >
          {/* Dashboard */}
          <Button
            onClick={() => handleNavClick('dashboard')}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              fontSize: '1.1rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: isActiveTab('dashboard') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Dashboard
          </Button>

          {/* ============================================================ */}
          {/* BOTÓN EMPLEADOS (con o sin dropdown según permisos) */}
          {/* ============================================================ */}
          {canManageEmployees ? (
            <>
              {/* Si tiene permisos: Botón con dropdown */}
              <Button
                onClick={handleEmployeesMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={(theme) => ({
                  color: '#18222b',
                  ...(theme.typography as any).navLink,
                  fontSize: '1.1rem',
                  px: 2,
                  py: 1.5,
                  position: 'relative',
                  borderRadius: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#1976d2',
                    transform: employeesMenuItems.some(item => isActiveTab(item.value)) || isActiveTab('employees')
                      ? 'scaleX(1)'
                      : 'scaleX(0)',
                    transition: 'transform 0.2s ease',
                  },
                })}
              >
                Empleados
              </Button>

              {/* Menú desplegable de Empleados */}
              <Menu
                anchorEl={employeesAnchorEl}
                open={isEmployeesMenuOpen}
                onClose={handleEmployeesMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: '12px',
                    boxShadow: '0 20px 60px rgba(24, 34, 43, 0.08)',
                  },
                }}
              >
                {employeesMenuItems.map((item) => (
                  <MenuItem
                    key={item.value}
                    onClick={() => handleEmployeesItemClick(item.value)}
                    selected={isActiveTab(item.value)}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(25, 118, 210, 0.12)',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              {/* Si NO tiene permisos: Botón simple sin dropdown */}
              <Button
                onClick={() => handleNavClick('employees')}
                sx={(theme) => ({
                  color: '#18222b',
                  ...(theme.typography as any).navLink,
                  fontSize: '1.1rem',
                  px: 2,
                  py: 1.5,
                  position: 'relative',
                  borderRadius: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#1976d2',
                    transform: isActiveTab('employees') ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.2s ease',
                  },
                })}
              >
                Empleados
              </Button>
            </>
          )}

          {/* Proyectos */}
          <Button
            onClick={() => handleNavClick('projects')}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              fontSize: '1.1rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: isActiveTab('projects') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Proyectos
          </Button>

          {/* Oportunidades */}
          <Button
            onClick={() => handleNavClick('opportunities')}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              fontSize: '1.1rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: isActiveTab('opportunities') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Oportunidades
          </Button>

          {/* Clientes */}
          <Button
            onClick={() => handleNavClick('clients')}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              fontSize: '1.1rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: isActiveTab('clients') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Clientes
          </Button>

          {/* ============================================================ */}
          {/* BOTÓN AREA CON DROPDOWN */}
          {/* ============================================================ */}
          <Button
            onClick={handleAreaMenuOpen}
            endIcon={<KeyboardArrowDown />}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              fontSize: '1.1rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: areaMenuItems.some(item => isActiveTab(item.value))
                  ? 'scaleX(1)'
                  : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Area
          </Button>

          {/* Menú desplegable de Area */}
          <Menu
            anchorEl={anchorEl}
            open={isAreaMenuOpen}
            onClose={handleAreaMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPaper-root': {
                mt: 1,
                minWidth: 180,
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(24, 34, 43, 0.08)',
              },
            }}
          >
            {areaMenuItems.map((item) => (
              <MenuItem
                key={item.value}
                onClick={() => handleAreaItemClick(item.value)}
                selected={isActiveTab(item.value)}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Ayuda */}
          <Button
            onClick={() => handleNavClick('ayuda')}
            sx={(theme) => ({
              color: '#18222b',
              ...(theme.typography as any).navLink,
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1976d2',
                transform: isActiveTab('ayuda') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Ayuda
          </Button>
        </Box>

        {/* ============================================================ */}
        {/* USER SECTION */}
        {/* ============================================================ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 2 }}>
          {/* Botón de notificaciones */}
          <Box
            sx={{
              backgroundColor: '#cfcfcf',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <IconButton
              size="small"
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <NotificationsIcon sx={{ color: '#4d5b66' }} />
            </IconButton>
          </Box>
          
          {/* Avatar del usuario */}
          <IconButton onClick={() => navigate('/employees/1')} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                backgroundColor: '#1976d2',
              }}
            >
              U
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
