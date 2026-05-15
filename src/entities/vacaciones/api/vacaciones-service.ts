import type { Vacation } from '../model/types';
import { vacations, saveVacationsToStorage } from '../model/vacaciones-mock';

export const vacacionesService = {
  getAll: async (): Promise<Vacation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...vacations]);
      }, 100);
    });
  },

  getByEmployeeId: async (employeeId: string): Promise<Vacation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employeeVacations = vacations.filter(
          (vacation) => vacation.field_solicitante === employeeId
        );
        resolve(employeeVacations);
      }, 100);
    });
  },

  getById: async (id: string): Promise<Vacation | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vacation = vacations.find((v) => v.id === id);
        resolve(vacation);
      }, 100);
    });
  },

  create: async (vacation: Omit<Vacation, 'id'>): Promise<Vacation> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVacation: Vacation = {
          ...vacation,
          id: `vac-${Date.now()}`,
        };
        vacations.push(newVacation);
        saveVacationsToStorage(vacations);
        resolve(newVacation);
      }, 100);
    });
  },

  update: async (id: string, vacation: Partial<Vacation>): Promise<Vacation> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = vacations.findIndex((v) => v.id === id);
        if (index === -1) {
          reject(new Error(`Vacation with id ${id} not found`));
          return;
        }
        vacations[index] = { ...vacations[index], ...vacation };
        saveVacationsToStorage(vacations);
        resolve(vacations[index]);
      }, 100);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = vacations.findIndex((v) => v.id === id);
        if (index === -1) {
          reject(new Error(`Vacation with id ${id} not found`));
          return;
        }
        vacations.splice(index, 1);
        saveVacationsToStorage(vacations);
        resolve();
      }, 100);
    });
  },
};
