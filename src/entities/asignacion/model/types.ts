/**
 * Tipos relacionados con la entidad Asignacion
 * Representa las asignaciones mensuales de empleados a proyectos
 */

/**
 * Estados posibles de una asignación
 */
export type AsignacionEstado = 'Forecast' | 'Cierre' | 'Ajuste' | 'Previsión';

/**
 * Interface principal de Asignacion
 */
export interface Asignacion {
  id: string;
  field_empleado: string; // ObjectId → usuarios
  field_proyecto_mkt: string; // ObjectId → proyectos o mkts
  field_mes_horas: string; // ObjectId → mes_horas
  field_horas: number; // Horas asignadas
  field_estado: AsignacionEstado; // Estado de la asignación
  field_comentarios?: string; // Comentarios opcionales
}

/**
 * Type para crear una nueva asignación (sin id)
 */
export type AsignacionCreate = Omit<Asignacion, 'id'>;

/**
 * Type para actualizar una asignación (campos opcionales)
 */
export type AsignacionUpdate = Partial<AsignacionCreate>;
