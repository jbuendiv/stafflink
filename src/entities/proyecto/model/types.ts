/**
 * Tipos relacionados con la entidad Proyecto
 */

/**
 * Estado del proyecto
 */
export const EstadoProyecto = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export type EstadoProyecto = typeof EstadoProyecto[keyof typeof EstadoProyecto];

/**
 * Interface principal de Proyecto
 */
export interface Proyecto {
  id: string;
  title: string;
  field_cliente: string; // ObjectId → clientes
  field_codigo_proyecto: string; // Único
  field_torre: string; // ObjectId → taxonomy_torre
  field_manager: string; // ObjectId → usuarios
  field_manager_proyecto: string; // ObjectId → usuarios (Project Manager)
  field_lider_tecnico: string; // ObjectId → usuarios (Technical Lead)
  field_area: string[]; // Array<ObjectId> → taxonomy_area
  field_mkt: string; // ObjectId → mkts
  field_estado_proyecto: EstadoProyecto;
  field_start_date?: string; // Date en formato ISO
  field_end_date?: string; // Date en formato ISO
}

/**
 * Type para crear un nuevo proyecto (sin id)
 */
export type ProyectoCreate = Omit<Proyecto, 'id'>;

/**
 * Type para actualizar un proyecto (campos opcionales)
 */
export type ProyectoUpdate = Partial<ProyectoCreate>;
