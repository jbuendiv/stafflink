import { Client } from '@/types';
import { MOCK_CLIENTS } from '@/data/mockData';

const STORAGE_KEY = 'stafflink_clients';

export const clienteService = {
  getAll: (): Client[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLIENTS));
    return MOCK_CLIENTS;
  },
  
  getById: (id: string): Client | undefined => {
    return clienteService.getAll().find(c => c.id === id);
  },
  
  create: (client: Client): Client => {
    const clients = clienteService.getAll();
    const newClient = { ...client, id: `client-new-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newClient, ...clients]));
    return newClient;
  },
  
  update: (id: string, updates: Partial<Client>): Client => {
    const clients = clienteService.getAll();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    
    clients[index] = { ...clients[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    return clients[index];
  },

  delete: (id: string): void => {
    const clients = clienteService.getAll().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }
};
