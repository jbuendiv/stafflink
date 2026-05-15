/**
 * Servicio para operaciones con MesHoras
 */
import type { MesHoras, MesHorasCreate, MesHorasUpdate } from '../model/types';
import { mesHorasMock } from '../model/mes-horas-mock';

class MesHorasService {
  private mesHoras: MesHoras[] = [...mesHorasMock];

  async getAll(): Promise<MesHoras[]> {
    return Promise.resolve([...this.mesHoras]);
  }

  async getById(id: string): Promise<MesHoras | undefined> {
    return Promise.resolve(this.mesHoras.find((m) => m.id === id));
  }

  async getByOficinaAndMonth(
    oficinaId: string,
    mesAno: string
  ): Promise<MesHoras | undefined> {
    return Promise.resolve(
      this.mesHoras.find(
        (m) => m.field_oficina === oficinaId && m.field_mes_ano === mesAno
      )
    );
  }

  async getByMonth(mesAno: string): Promise<MesHoras[]> {
    return Promise.resolve(
      this.mesHoras.filter((m) => m.field_mes_ano === mesAno)
    );
  }

  async create(mesHoras: MesHorasCreate): Promise<MesHoras> {
    const newMesHoras: MesHoras = {
      ...mesHoras,
      id: `mes-horas-${Date.now()}`,
    };
    this.mesHoras.push(newMesHoras);
    return Promise.resolve(newMesHoras);
  }

  async update(id: string, updates: MesHorasUpdate): Promise<MesHoras | undefined> {
    const index = this.mesHoras.findIndex((m) => m.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    this.mesHoras[index] = { ...this.mesHoras[index], ...updates };
    return Promise.resolve(this.mesHoras[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.mesHoras.findIndex((m) => m.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.mesHoras.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const mesHorasService = new MesHorasService();
