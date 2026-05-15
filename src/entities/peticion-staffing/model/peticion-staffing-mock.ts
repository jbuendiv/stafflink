/**
 * Mock de datos para PeticionStaffing
 */
import type { PeticionStaffing } from './types';

export const peticionStaffingMock: PeticionStaffing[] = [
  // Petición sin empleado asignado - necesita Frontend Senior
  {
    id: '1',
    field_proyecto_mkt: '1', // Portal Web Bancario
    field_porcentaje_horas: 100,
    field_meses_asignacion: {
      start: '2024-07-01',
      end: '2024-09-30',
    },
    field_categoria: ['cat1'], // Frontend
    field_tipo_carrera: 'Senior',
    field_area: 'area1', // Desarrollo
    field_skills: ['react', 'typescript', 'css'],
    field_idiomas: 'es',
  },
  // Petición sin empleado - necesita Backend Mid
  {
    id: '2',
    field_proyecto_mkt: '2', // App Móvil Retail
    field_porcentaje_horas: 75,
    field_meses_asignacion: {
      start: '2024-08-01',
      end: '2024-11-30',
    },
    field_categoria: ['cat2'], // Backend
    field_tipo_carrera: 'Mid',
    field_area: 'area1', // Desarrollo
    field_skills: ['nodejs', 'mongodb', 'api-rest'],
    field_idiomas: 'en',
  },
  // Petición con empleado ya asignado
  {
    id: '3',
    field_empleado: '1', // Juan García
    field_proyecto_mkt: '1', // Portal Web Bancario
    field_porcentaje_horas: 100,
    field_meses_asignacion: {
      start: '2024-05-01',
      end: '2024-06-30',
    },
    field_categoria: ['cat1'], // Frontend
    field_tipo_carrera: 'Senior',
    field_area: 'area1', // Desarrollo
    field_skills: ['react', 'typescript'],
  },
  // Petición sin empleado - necesita Fullstack
  {
    id: '4',
    field_proyecto_mkt: '3', // ERP Cloud
    field_porcentaje_horas: 50,
    field_meses_asignacion: {
      start: '2024-07-15',
      end: '2024-10-15',
    },
    field_categoria: ['cat1', 'cat2'], // Frontend + Backend
    field_tipo_carrera: 'Mid',
    field_area: 'area1', // Desarrollo
    field_skills: ['react', 'nodejs', 'postgresql'],
    field_idiomas: 'es',
  },
  // Petición sin empleado - necesita Lead técnico
  {
    id: '5',
    field_proyecto_mkt: '3', // ERP Cloud
    field_porcentaje_horas: 100,
    field_meses_asignacion: {
      start: '2024-06-01',
      end: '2024-12-31',
    },
    field_tipo_carrera: 'Lead',
    field_area: 'area1', // Desarrollo
    field_skills: ['arquitectura', 'cloud', 'microservicios'],
    field_idiomas: 'en',
  },
];
