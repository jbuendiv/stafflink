/**
 * Servicio para operaciones con Proyecto
 */
import type { Proyecto, ProyectoCreate, ProyectoUpdate } from '../model/types';
import { proyectosMock } from '../model/proyecto-mock';

class ProyectoService {
  private proyectos: Proyecto[] = [...proyectosMock];

  async getAll(): Promise<Proyecto[]> {
    return Promise.resolve([...this.proyectos]);
  }

  async getById(id: string): Promise<Proyecto | undefined> {
    return Promise.resolve(this.proyectos.find((p) => p.id === id));
  }

  async getByCliente(clienteId: string): Promise<Proyecto[]> {
    return Promise.resolve(
      this.proyectos.filter((p) => p.field_cliente === clienteId)
    );
  }

  async create(proyecto: ProyectoCreate): Promise<Proyecto> {
    const newProyecto: Proyecto = {
      ...proyecto,
      id: `proyecto-${Date.now()}`,
    };
    this.proyectos.push(newProyecto);
    return Promise.resolve(newProyecto);
  }

  async update(id: string, updates: ProyectoUpdate): Promise<Proyecto | undefined> {
    const index = this.proyectos.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    this.proyectos[index] = { ...this.proyectos[index], ...updates };
    return Promise.resolve(this.proyectos[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.proyectos.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.proyectos.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const proyectoService = new ProyectoService();
