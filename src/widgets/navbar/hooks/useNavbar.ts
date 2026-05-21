// ============================================================
// IMPORTS
// ============================================================
import { useState, type MouseEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ============================================================
// TYPES
// ============================================================
// Estructura de un item de navegación
interface NavItem {
  label: string // Texto visible del item
  value: string // Identificador único del item
}

// Props del hook useNavbar
interface UseNavbarProps {
  activePage: string   // Página activa inicial
  areaItems: NavItem[] // Items del menú desplegable de área
}

// ============================================================
// CONSTANTS
// ============================================================
// Mapeo de valores de navegación a rutas
const ROUTE_MAP: Record<string, string> = {
  dashboard: '/',
  employees: '/employees',
  projects: '/projects',
  opportunities: '/opportunities',
  clients: '/clients',
  area: '/area',
  informes: '/area/informes',
  piramide: '/area/piramide',
  vacaciones: '/area/vacaciones',
  'gestionar-vacaciones': '/area/gestionar-vacaciones',
  notificacion: '/area/notificacion',
  ayuda: '/ayuda',
}

// ============================================================
// HOOK
// ============================================================
export function useNavbar({ activePage }: UseNavbarProps) {
  // Hooks de React Router
  const navigate = useNavigate()
  const location = useLocation()

  // Estado: Elemento ancla para el menú desplegable de Area
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Computed: Calcula la tab activa basándose en la ruta actual
  const activeTab = (() => {
    const currentPath = location.pathname

    // Busca qué tab corresponde a la ruta actual
    for (const [key, route] of Object.entries(ROUTE_MAP)) {
      if (currentPath.startsWith(route) && route !== '/') {
        return key
      }
    }

    // Si es la ruta raíz, retornar dashboard
    if (currentPath === '/') {
      return 'dashboard'
    }

    // Fallback al activePage inicial
    return activePage.toLowerCase()
  })()

  // Computed: Verifica si el menú de área está abierto
  const isAreaMenuOpen = Boolean(anchorEl)

  // Handler: Abre el menú desplegable de Area
  const handleAreaMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // Handler: Cierra el menú desplegable de Area
  const handleAreaMenuClose = () => {
    setAnchorEl(null)
  }

  // Handler: Maneja el click en un item de navegación regular
  const handleNavClick = (value: string) => {
    const route = ROUTE_MAP[value]
    if (route) {
      navigate(route)
    }
  }

  // Handler: Maneja el click en un item del menú desplegable
  const handleAreaItemClick = (value: string) => {
    const route = ROUTE_MAP[value]
    if (route) {
      navigate(route)
    }
    handleAreaMenuClose()
  }

  // Helper: Verifica si una tab está activa
  const isActiveTab = (value: string) => activeTab === value

  return {
    anchorEl,
    isAreaMenuOpen,
    handleAreaMenuOpen,
    handleAreaMenuClose,
    handleNavClick,
    handleAreaItemClick,
    isActiveTab,
  }
}
