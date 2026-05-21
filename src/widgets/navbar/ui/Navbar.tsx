// ============================================================
// IMPORTS
// ============================================================
// Componentes de Material-UI para la interfaz
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  KeyboardArrowDown,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useNavbar } from '../hooks/useNavbar'
import logoImg from '@/shared/assets/images/logo.png'
import { useAuth } from '@/features/auth/AuthContext'

interface NavbarProps {
  activePage?: string
}

const areaMenuItems = [
  { label: 'Informes', value: 'informes' },
  { label: 'Piramide', value: 'piramide' },
  { label: 'Vacaciones', value: 'vacaciones' },
  { label: 'Notificacion', value: 'notificacion' },
  { label: 'Taxonomías', value: 'taxonomias' },
]

export function Navbar({ activePage = 'dashboard' }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const userRole = 'administrador'
  const canManageEmployees = ['administrador', 'responsable staffing'].includes(userRole.toLowerCase())
  
  const {
    anchorEl,
    isAreaMenuOpen,
    handleAreaMenuOpen,
    handleAreaMenuClose,
    handleNavClick,
    handleAreaItemClick,
    isActiveTab,
  } = useNavbar({ 
    activePage, 
    areaItems: areaMenuItems,
  })

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const navItems = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Empleados', value: 'employees' },
    { label: 'Proyectos', value: 'projects' },
    { label: 'Clientes', value: 'clients' },
  ]

  const onNavClickMobile = (val: string) => {
    handleNavClick(val)
    setMobileOpen(false)
  }

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src={logoImg}
            alt="Stafflink Logo"
            sx={{ height: '40px', mr: 3 }}
          />
        </Box>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 1,
            gap: 0.5,
            justifyContent: 'flex-end',
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              sx={(theme) => ({
                color: '#0f172a',
                fontSize: '1.05rem',
                px: 2,
                py: 1.5,
                position: 'relative',
                borderRadius: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(26, 86, 219, 0.08)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#1a56db',
                  transform: isActiveTab(item.value) ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 0.2s ease',
                },
              })}
            >
              {item.label}
            </Button>
          ))}

          <Button
            onClick={handleAreaMenuOpen}
            endIcon={<KeyboardArrowDown />}
            sx={(theme) => ({
              color: '#0f172a',
              fontSize: '1.05rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(26, 86, 219, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1a56db',
                transform: areaMenuItems.some(item => isActiveTab(item.value)) ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Area
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={isAreaMenuOpen}
            onClose={handleAreaMenuClose}
            sx={{
              '& .MuiPaper-root': {
                mt: 1,
                minWidth: 180,
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                border: '1px solid #e2e8f0',
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
                    backgroundColor: 'rgba(26, 86, 219, 0.12)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(26, 86, 219, 0.08)',
                  },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          <Button
            onClick={() => handleNavClick('ayuda')}
            sx={(theme) => ({
              color: '#0f172a',
              fontSize: '1.05rem',
              px: 2,
              py: 1.5,
              position: 'relative',
              borderRadius: 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(26, 86, 219, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#1a56db',
                transform: isActiveTab('ayuda') ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s ease',
              },
            })}
          >
            Ayuda
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 }, ml: 2 }}>
          <Box
            sx={{
              backgroundColor: '#e2e8f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 0.5, sm: 1 },
            }}
          >
            <IconButton
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(26, 86, 219, 0.08)',
                },
              }}
            >
              <NotificationsIcon sx={{ color: '#475569', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
          
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                backgroundColor: '#1a56db',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/employees/user'); }}>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, backgroundColor: '#ffffff' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <Box component="img" src={logoImg} alt="Stafflink Logo" sx={{ height: '40px' }} />
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton 
                onClick={() => onNavClickMobile(item.value)}
                selected={isActiveTab(item.value)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(26, 86, 219, 0.1)',
                    borderLeft: '4px solid #1a56db',
                  }
                }}
              >
                <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: isActiveTab(item.value) ? 600 : 400, color: '#0f172a' }}>{item.label}</Typography>} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleAreaMenuOpen} sx={{ width: '100%' }}>
              <ListItemText primary={<Typography variant="body1" sx={{ color: '#0f172a' }}>Area</Typography>} />
              <KeyboardArrowDown />
            </ListItemButton>
          </ListItem>
          {isAreaMenuOpen && areaMenuItems.map((item) => (
            <ListItem key={item.value} disablePadding sx={{ pl: 4 }}>
              <ListItemButton onClick={() => { handleAreaItemClick(item.value); setMobileOpen(false); }} sx={{ width: '100%' }}>
                <ListItemText primary={<Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#475569' }}>{item.label}</Typography>} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={() => onNavClickMobile('ayuda')} sx={{ width: '100%' }}>
              <ListItemText primary={<Typography variant="body1" sx={{ color: '#0f172a' }}>Ayuda</Typography>} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  )
}
