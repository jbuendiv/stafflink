/**
 * Servicio para operaciones con Asignacion
 */
import type { Asignacion, AsignacionCreate, AsignacionUpdate } from '../model/types';
import { asignacionMock } from '../model/asignacion-mock';

class AsignacionService {
  private asignaciones: Asignacion[] = [...asignacionMock];

  async getAll(): Promise<Asignacion[]> {
    return Promise.resolve([...this.asignaciones]);
  }

  async getById(id: string): Promise<Asignacion | undefined> {
    return Promise.resolve(this.asignaciones.find((a) => a.id === id));
  }

  async getByEmpleado(empleadoId: string): Promise<Asignacion[]> {
    return Promise.resolve(
      this.asignaciones.filter((a) => a.field_empleado === empleadoId)
    );
  }

  async getByEmpleadoAndMonth(
    empleadoId: string,
    mesHorasId: string
  ): Promise<Asignacion[]> {
    return Promise.resolve(
      this.asignaciones.filter(
        (a) => a.field_empleado === empleadoId && a.field_mes_horas === mesHorasId
      )
    );
  }

  async getByProyecto(proyectoId: string): Promise<Asignacion[]> {
    return Promise.resolve(
      this.asignaciones.filter((a) => a.field_proyecto_mkt === proyectoId)
    );
  }

  async getByMonth(mesHorasId: string): Promise<Asignacion[]> {
    return Promise.resolve(
      this.asignaciones.filter((a) => a.field_mes_horas === mesHorasId)
    );
  }

  async create(asignacion: AsignacionCreate): Promise<Asignacion> {
    const newAsignacion: Asignacion = {
      ...asignacion,
      id: `asignacion-${Date.now()}`,
    };
    this.asignaciones.push(newAsignacion);
    return Promise.resolve(newAsignacion);
  }

  async update(id: string, updates: AsignacionUpdate): Promise<Asignacion | undefined> {
    const index = this.asignaciones.findIndex((a) => a.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    this.asignaciones[index] = { ...this.asignaciones[index], ...updates };
    return Promise.resolve(this.asignaciones[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.asignaciones.findIndex((a) => a.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.asignaciones.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const asignacionService = new AsignacionService();

