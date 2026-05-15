/**
 * Tipos relacionados con la entidad MesHoras (Calendario Mensual)
 */

/**
 * Interface principal de MesHoras
 * Representa las horas disponibles por oficina y mes
 */
export interface MesHoras {
  id: string;
  field_mes_ano: string; // Date (timestamp) en formato ISO
  field_oficina: string; // ObjectId → taxonomy_oficina
  field_horas: number; // Horas laborables del mes
  field_festivos?: string[]; // Array de fechas festivas en formato ISO
}

/**
 * Type para crear un nuevo registro (sin id)
 */
export type MesHorasCreate = Omit<MesHoras, 'id'>;

/**
 * Type para actualizar un registro (campos opcionales)
 */
export type MesHorasUpdate = Partial<MesHorasCreate>;
