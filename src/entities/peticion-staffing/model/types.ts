/**
 * Tipos relacionados con la entidad PeticionStaffing
 * Representa las peticiones de staffing para proyectos
 */

/**
 * Tipos de carrera para peticiones de staffing
 */
export type TipoCarrera = 'Junior' | 'Mid' | 'Senior' | 'Lead';

/**
 * Interface para el rango de meses de asignación
 */
export interface MesesAsignacion {
  start: string; // Fecha de inicio (ISO string)
  end: string; // Fecha de fin (ISO string)
}

/**
 * Interface principal de PeticionStaffing
 */
export interface PeticionStaffing {
  id: string;
  field_empleado?: string; // ObjectId → usuarios (opcional)
  field_proyecto_mkt: string; // ObjectId → proyectos o mkts (requerido)
  field_porcentaje_horas: number; // 1 a 100
  field_meses_asignacion: MesesAsignacion; // Rango de fechas
  field_categoria?: string[]; // Array de ObjectId → taxonomy_categoria_staffing
  field_tipo_carrera?: TipoCarrera; // Enum
  field_area?: string; // ObjectId → taxonomy_area
  field_skills?: string[]; // Array de ObjectId → taxonomy_skills
  field_idiomas?: string; // ObjectId → taxonomy_idiomas
}

/**
 * Type para crear una nueva petición (sin id)
 */
export type PeticionStaffingCreate = Omit<PeticionStaffing, 'id'>;

/**
 * Type para actualizar una petición (campos opcionales)
 */
export type PeticionStaffingUpdate = Partial<PeticionStaffingCreate>;
