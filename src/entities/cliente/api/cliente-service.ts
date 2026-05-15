/**
 * Servicio para operaciones con Cliente
 */
import type { Cliente, ClienteCreate, ClienteUpdate } from '../model/types';
import { clientesMock } from '../model/cliente-mock';

class ClienteService {
  private clientes: Cliente[] = [...clientesMock];

  async getAll(): Promise<Cliente[]> {
    return Promise.resolve([...this.clientes]);
  }

  async getById(id: string): Promise<Cliente | undefined> {
    return Promise.resolve(this.clientes.find((c) => c.id === id));
  }

  async create(cliente: ClienteCreate): Promise<Cliente> {
    const newCliente: Cliente = {
      ...cliente,
      id: `cliente-${Date.now()}`,
    };
    this.clientes.push(newCliente);
    return Promise.resolve(newCliente);
  }

  async update(id: string, updates: ClienteUpdate): Promise<Cliente | undefined> {
    const index = this.clientes.findIndex((c) => c.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    this.clientes[index] = { ...this.clientes[index], ...updates };
    return Promise.resolve(this.clientes[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clientes.findIndex((c) => c.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    this.clientes.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const clienteService = new ClienteService();
