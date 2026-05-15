/**
 * Servicio para operaciones con PeticionStaffing
 */
import type {
  PeticionStaffing,
  PeticionStaffingCreate,
  PeticionStaffingUpdate,
} from '../model/types';
import { peticionStaffingMock } from '../model/peticion-staffing-mock';

class PeticionStaffingService {
  private peticiones: PeticionStaffing[] = [...peticionStaffingMock];

  async getAll(): Promise<PeticionStaffing[]> {
    return Promise.resolve([...this.peticiones]);
  }

  async getById(id: string): Promise<PeticionStaffing | undefined> {
    return Promise.resolve(this.peticiones.find((p) => p.id === id));
  }

  /**
   * Obtener peticiones sin empleado asignado (disponibles para staffing)
   */
  async getUnassigned(): Promise<PeticionStaffing[]> {
    return Promise.resolve(
      this.peticiones.filter((p) => !p.field_empleado)
    );
  }

  /**
   * Obtener peticiones asignadas a un empleado específico
   */
  async getByEmpleado(empleadoId: string): Promise<PeticionStaffing[]> {
    return Promise.resolve(
      this.peticiones.filter((p) => p.field_empleado === empleadoId)
    );
  }

  /**
   * Obtener peticiones de un proyecto específico
   */
  async getByProyecto(proyectoId: string): Promise<PeticionStaffing[]> {
    return Promise.resolve(
      this.peticiones.filter((p) => p.field_proyecto_mkt === proyectoId)
    );
  }

  /**
   * Obtener peticiones activas en un rango de fechas
   */
  async getByDateRange(startDate: string, endDate: string): Promise<PeticionStaffing[]> {
    return Promise.resolve(
      this.peticiones.filter((p) => {
        const peticionStart = new Date(p.field_meses_asignacion.start);
        const peticionEnd = new Date(p.field_meses_asignacion.end);
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);
        
        // Verificar si hay solapamiento
        return peticionStart <= rangeEnd && peticionEnd >= rangeStart;
      })
    );
  }

  async create(peticion: PeticionStaffingCreate): Promise<PeticionStaffing> {
    const newPeticion: PeticionStaffing = {
      ...peticion,
      id: `peticion-${Date.now()}`,
    };
    this.peticiones.push(newPeticion);
    return Promise.resolve(newPeticion);
  }

  async update(
    id: string,
    updates: PeticionStaffingUpdate
  ): Promise<PeticionStaffing | undefined> {
    const index = this.peticiones.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    this.peticiones[index] = { ...this.peticiones[index], ...updates };
    return Promise.resolve(this.peticiones[index]);
  }

  /**
   * Asignar un empleado a una petición
   */
  async assignEmpleado(
    peticionId: string,
    empleadoId: string
  ): Promise<PeticionStaffing | undefined> {
    return this.update(peticionId, { field_empleado: empleadoId });
  }

  /**
   * Desasignar empleado de una petición
   */
  async unassignEmpleado(peticionId: string): Promise<PeticionStaffing | undefined> {
    return this.update(peticionId, { field_empleado: undefined });
  }

  async delete(id: string): Promise<boolean> {
    const index = this.peticiones.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.peticiones.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const peticionStaffingService = new PeticionStaffingService();
