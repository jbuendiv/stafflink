/**
 * Mock de datos para Asignacion
 * 
 * Distribución de 20 empleados en 5 proyectos activos:
 * - Proyecto 1: user-1, user-2, user-7, user-8 (4 empleados)
 * - Proyecto 2: user-3, user-5, user-6, user-10, user-17 (5 empleados)
 * - Proyecto 3: user-9, user-12, user-13, user-20 (4 empleados)
 * - Proyecto 5: user-4, user-11, user-14, user-15 (4 empleados)
 * - Proyecto 6: user-16, user-18, user-19 (3 empleados)
 * 
 * Mapeo oficinas → mes-horas:
 * - MAD: 1 (mayo), 3 (junio), 5 (julio)
 * - BCN: 2 (mayo), 4 (junio), 6 (julio)
 * - VLC: 7 (mayo), 8 (junio), 9 (julio)
 * - SEV: 10 (mayo), 11 (junio), 12 (julio)
 */
import type { Asignacion } from './types';

export const asignacionMock: Asignacion[] = [
  // =====================================================
  // MAYO 2026 - 20 empleados distribuidos en 5 proyectos
  // =====================================================
  
  // PROYECTO 1: Portal Digital Santander (4 empleados)
  { id: '1', field_empleado: 'user-1', field_proyecto_mkt: '1', field_mes_horas: '1', field_horas: 150, field_estado: 'Cierre', field_comentarios: 'Desarrollo frontend principal' },
  { id: '2', field_empleado: 'user-2', field_proyecto_mkt: '1', field_mes_horas: '1', field_horas: 100, field_estado: 'Cierre', field_comentarios: 'Coordinación técnica' },
  { id: '3', field_empleado: 'user-7', field_proyecto_mkt: '1', field_mes_horas: '1', field_horas: 80, field_estado: 'Cierre', field_comentarios: 'Testing y QA' },
  { id: '4', field_empleado: 'user-8', field_proyecto_mkt: '1', field_mes_horas: '1', field_horas: 120, field_estado: 'Cierre', field_comentarios: 'Desarrollo backend' },
  
  // PROYECTO 2: App Móvil BBVA (5 empleados)
  { id: '5', field_empleado: 'user-3', field_proyecto_mkt: '2', field_mes_horas: '2', field_horas: 60, field_estado: 'Cierre', field_comentarios: 'Desarrollo backend' },
  { id: '6', field_empleado: 'user-5', field_proyecto_mkt: '2', field_mes_horas: '2', field_horas: 120, field_estado: 'Cierre', field_comentarios: 'Desarrollo UI' },
  { id: '7', field_empleado: 'user-6', field_proyecto_mkt: '2', field_mes_horas: '10', field_horas: 50, field_estado: 'Cierre', field_comentarios: 'Consultoría técnica' },
  { id: '8', field_empleado: 'user-10', field_proyecto_mkt: '2', field_mes_horas: '7', field_horas: 140, field_estado: 'Cierre', field_comentarios: 'Arquitectura backend' },
  { id: '9', field_empleado: 'user-17', field_proyecto_mkt: '2', field_mes_horas: '2', field_horas: 90, field_estado: 'Cierre', field_comentarios: 'Desarrollo frontend' },
  
  // PROYECTO 3: Migración Cloud Telefónica (4 empleados)
  { id: '10', field_empleado: 'user-9', field_proyecto_mkt: '3', field_mes_horas: '2', field_horas: 130, field_estado: 'Cierre', field_comentarios: 'Desarrollo UI' },
  { id: '11', field_empleado: 'user-12', field_proyecto_mkt: '3', field_mes_horas: '1', field_horas: 110, field_estado: 'Cierre', field_comentarios: 'DevOps' },
  { id: '12', field_empleado: 'user-13', field_proyecto_mkt: '3', field_mes_horas: '2', field_horas: 100, field_estado: 'Cierre', field_comentarios: 'Testing' },
  { id: '13', field_empleado: 'user-20', field_proyecto_mkt: '3', field_mes_horas: '1', field_horas: 70, field_estado: 'Cierre', field_comentarios: 'QA' },
  
  // PROYECTO 5: Plataforma Digital Mercadona (4 empleados)
  { id: '14', field_empleado: 'user-4', field_proyecto_mkt: '5', field_mes_horas: '7', field_horas: 100, field_estado: 'Cierre', field_comentarios: 'DevOps y Cloud' },
  { id: '15', field_empleado: 'user-11', field_proyecto_mkt: '5', field_mes_horas: '10', field_horas: 120, field_estado: 'Cierre', field_comentarios: 'Gestión proyecto' },
  { id: '16', field_empleado: 'user-14', field_proyecto_mkt: '5', field_mes_horas: '7', field_horas: 80, field_estado: 'Cierre', field_comentarios: 'Desarrollo frontend' },
  { id: '17', field_empleado: 'user-15', field_proyecto_mkt: '5', field_mes_horas: '10', field_horas: 130, field_estado: 'Cierre', field_comentarios: 'Desarrollo backend' },
  
  // PROYECTO 6: Sistema CRM Telefónica (3 empleados)
  { id: '18', field_empleado: 'user-16', field_proyecto_mkt: '6', field_mes_horas: '1', field_horas: 140, field_estado: 'Cierre', field_comentarios: 'Arquitectura técnica' },
  { id: '19', field_empleado: 'user-18', field_proyecto_mkt: '6', field_mes_horas: '7', field_horas: 110, field_estado: 'Cierre', field_comentarios: 'DevOps' },
  { id: '20', field_empleado: 'user-19', field_proyecto_mkt: '6', field_mes_horas: '10', field_horas: 90, field_estado: 'Cierre', field_comentarios: 'Gestión proyecto' },

  // =====================================================
  // JUNIO 2026
  // =====================================================
  
  // PROYECTO 1: Portal Digital Santander
  { id: '21', field_empleado: 'user-1', field_proyecto_mkt: '1', field_mes_horas: '3', field_horas: 160, field_estado: 'Ajuste', field_comentarios: 'Sprint final' },
  { id: '22', field_empleado: 'user-2', field_proyecto_mkt: '1', field_mes_horas: '3', field_horas: 90, field_estado: 'Ajuste' },
  { id: '23', field_empleado: 'user-7', field_proyecto_mkt: '1', field_mes_horas: '3', field_horas: 140, field_estado: 'Forecast', field_comentarios: 'Pruebas de integración' },
  { id: '24', field_empleado: 'user-8', field_proyecto_mkt: '1', field_mes_horas: '3', field_horas: 110, field_estado: 'Forecast' },
  
  // PROYECTO 2: App Móvil BBVA
  { id: '25', field_empleado: 'user-3', field_proyecto_mkt: '2', field_mes_horas: '4', field_horas: 70, field_estado: 'Forecast' },
  { id: '26', field_empleado: 'user-5', field_proyecto_mkt: '2', field_mes_horas: '4', field_horas: 130, field_estado: 'Forecast' },
  { id: '27', field_empleado: 'user-6', field_proyecto_mkt: '2', field_mes_horas: '11', field_horas: 60, field_estado: 'Forecast' },
  { id: '28', field_empleado: 'user-10', field_proyecto_mkt: '2', field_mes_horas: '8', field_horas: 150, field_estado: 'Forecast' },
  { id: '29', field_empleado: 'user-17', field_proyecto_mkt: '2', field_mes_horas: '4', field_horas: 100, field_estado: 'Forecast' },
  
  // PROYECTO 3: Migración Cloud Telefónica
  { id: '30', field_empleado: 'user-9', field_proyecto_mkt: '3', field_mes_horas: '4', field_horas: 140, field_estado: 'Forecast' },
  { id: '31', field_empleado: 'user-12', field_proyecto_mkt: '3', field_mes_horas: '3', field_horas: 120, field_estado: 'Forecast' },
  { id: '32', field_empleado: 'user-13', field_proyecto_mkt: '3', field_mes_horas: '4', field_horas: 110, field_estado: 'Forecast' },
  { id: '33', field_empleado: 'user-20', field_proyecto_mkt: '3', field_mes_horas: '3', field_horas: 80, field_estado: 'Forecast' },
  
  // PROYECTO 5: Plataforma Digital Mercadona
  { id: '34', field_empleado: 'user-4', field_proyecto_mkt: '5', field_mes_horas: '8', field_horas: 110, field_estado: 'Forecast' },
  { id: '35', field_empleado: 'user-11', field_proyecto_mkt: '5', field_mes_horas: '11', field_horas: 130, field_estado: 'Forecast' },
  { id: '36', field_empleado: 'user-14', field_proyecto_mkt: '5', field_mes_horas: '8', field_horas: 90, field_estado: 'Forecast' },
  { id: '37', field_empleado: 'user-15', field_proyecto_mkt: '5', field_mes_horas: '11', field_horas: 140, field_estado: 'Forecast' },
  
  // PROYECTO 6: Sistema CRM Telefónica
  { id: '38', field_empleado: 'user-16', field_proyecto_mkt: '6', field_mes_horas: '3', field_horas: 150, field_estado: 'Forecast' },
  { id: '39', field_empleado: 'user-18', field_proyecto_mkt: '6', field_mes_horas: '8', field_horas: 120, field_estado: 'Forecast' },
  { id: '40', field_empleado: 'user-19', field_proyecto_mkt: '6', field_mes_horas: '11', field_horas: 100, field_estado: 'Forecast' },

  // =====================================================
  // JULIO 2026
  // =====================================================
  
  // PROYECTO 1: Portal Digital Santander
  { id: '41', field_empleado: 'user-1', field_proyecto_mkt: '1', field_mes_horas: '5', field_horas: 140, field_estado: 'Previsión' },
  { id: '42', field_empleado: 'user-2', field_proyecto_mkt: '1', field_mes_horas: '5', field_horas: 110, field_estado: 'Previsión' },
  { id: '43', field_empleado: 'user-7', field_proyecto_mkt: '1', field_mes_horas: '5', field_horas: 60, field_estado: 'Previsión' },
  { id: '44', field_empleado: 'user-8', field_proyecto_mkt: '1', field_mes_horas: '5', field_horas: 100, field_estado: 'Previsión' },
  
  // PROYECTO 2: App Móvil BBVA
  { id: '45', field_empleado: 'user-3', field_proyecto_mkt: '2', field_mes_horas: '6', field_horas: 50, field_estado: 'Previsión' },
  { id: '46', field_empleado: 'user-5', field_proyecto_mkt: '2', field_mes_horas: '6', field_horas: 120, field_estado: 'Previsión' },
  { id: '47', field_empleado: 'user-6', field_proyecto_mkt: '2', field_mes_horas: '12', field_horas: 70, field_estado: 'Previsión' },
  { id: '48', field_empleado: 'user-10', field_proyecto_mkt: '2', field_mes_horas: '9', field_horas: 130, field_estado: 'Previsión' },
  { id: '49', field_empleado: 'user-17', field_proyecto_mkt: '2', field_mes_horas: '6', field_horas: 90, field_estado: 'Previsión' },
  
  // PROYECTO 3: Migración Cloud Telefónica
  { id: '50', field_empleado: 'user-9', field_proyecto_mkt: '3', field_mes_horas: '6', field_horas: 120, field_estado: 'Previsión' },
  { id: '51', field_empleado: 'user-12', field_proyecto_mkt: '3', field_mes_horas: '5', field_horas: 100, field_estado: 'Previsión' },
  { id: '52', field_empleado: 'user-13', field_proyecto_mkt: '3', field_mes_horas: '6', field_horas: 90, field_estado: 'Previsión' },
  { id: '53', field_empleado: 'user-20', field_proyecto_mkt: '3', field_mes_horas: '5', field_horas: 60, field_estado: 'Previsión' },
  
  // PROYECTO 5: Plataforma Digital Mercadona
  { id: '54', field_empleado: 'user-4', field_proyecto_mkt: '5', field_mes_horas: '9', field_horas: 90, field_estado: 'Previsión' },
  { id: '55', field_empleado: 'user-11', field_proyecto_mkt: '5', field_mes_horas: '12', field_horas: 110, field_estado: 'Previsión' },
  { id: '56', field_empleado: 'user-14', field_proyecto_mkt: '5', field_mes_horas: '9', field_horas: 70, field_estado: 'Previsión' },
  { id: '57', field_empleado: 'user-15', field_proyecto_mkt: '5', field_mes_horas: '12', field_horas: 120, field_estado: 'Previsión' },
  
  // PROYECTO 6: Sistema CRM Telefónica
  { id: '58', field_empleado: 'user-16', field_proyecto_mkt: '6', field_mes_horas: '5', field_horas: 130, field_estado: 'Previsión' },
  { id: '59', field_empleado: 'user-18', field_proyecto_mkt: '6', field_mes_horas: '9', field_horas: 100, field_estado: 'Previsión' },
  { id: '60', field_empleado: 'user-19', field_proyecto_mkt: '6', field_mes_horas: '12', field_horas: 80, field_estado: 'Previsión' },
];
