/**
 * Types and utilities for employee availability calculations
 */

/**
 * Result of an availability calculation for a given mes-horas record
 */
export interface AvailabilityResult {
  empleadoId: string;
  mesHorasId: string;
  horasTotales: number;
  horasAsignadas: number;
  horasDisponibles: number;
  porcentajeDisponible: number;
}
