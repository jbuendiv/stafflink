import type { Vacation } from './types';

const STORAGE_KEY = 'stafflink_vacations_db';

const initialVacations: Vacation[] = [
  // User 1 - María García López
  { id: 'vac-1', field_rango_vacaciones: { start: '2023-01-01', end: '2023-01-05' }, field_solicitante: 'user-1', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-2', field_rango_vacaciones: { start: '2023-01-06', end: '2023-01-10' }, field_solicitante: 'user-1', field_responsable: 'user-1', field_estado: 'Pending' },
  { id: 'vac-3', field_rango_vacaciones: { start: '2023-07-15', end: '2023-07-30' }, field_solicitante: 'user-1', field_responsable: 'user-1', field_estado: 'Approved' },

  // User 2 - Carlos Rodríguez Pérez
  { id: 'vac-4', field_rango_vacaciones: { start: '2023-02-10', end: '2023-02-15' }, field_solicitante: 'user-2', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-5', field_rango_vacaciones: { start: '2023-08-01', end: '2023-08-15' }, field_solicitante: 'user-2', field_responsable: 'user-1', field_estado: 'Pending' },
  { id: 'vac-6', field_rango_vacaciones: { start: '2023-12-20', end: '2023-12-31' }, field_solicitante: 'user-2', field_responsable: 'user-1', field_estado: 'Rejected' },

  // User 3 - Ana Martínez Sánchez
  { id: 'vac-7', field_rango_vacaciones: { start: '2023-03-01', end: '2023-03-10' }, field_solicitante: 'user-3', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-8', field_rango_vacaciones: { start: '2023-06-15', end: '2023-06-25' }, field_solicitante: 'user-3', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-9', field_rango_vacaciones: { start: '2023-09-05', end: '2023-09-12' }, field_solicitante: 'user-3', field_responsable: 'user-2', field_estado: 'Pending' },

  // User 4 - David Fernández Ruiz
  { id: 'vac-10', field_rango_vacaciones: { start: '2023-04-10', end: '2023-04-20' }, field_solicitante: 'user-4', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-11', field_rango_vacaciones: { start: '2023-08-15', end: '2023-08-25' }, field_solicitante: 'user-4', field_responsable: 'user-1', field_estado: 'Approved' },

  // User 5 - Laura González Moreno
  { id: 'vac-12', field_rango_vacaciones: { start: '2023-05-01', end: '2023-05-10' }, field_solicitante: 'user-5', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-13', field_rango_vacaciones: { start: '2023-10-10', end: '2023-10-20' }, field_solicitante: 'user-5', field_responsable: 'user-2', field_estado: 'Pending' },
  { id: 'vac-14', field_rango_vacaciones: { start: '2023-12-22', end: '2023-12-29' }, field_solicitante: 'user-5', field_responsable: 'user-2', field_estado: 'Rejected' },

  // User 6 - Javier López Díaz
  { id: 'vac-15', field_rango_vacaciones: { start: '2023-01-15', end: '2023-01-22' }, field_solicitante: 'user-6', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-16', field_rango_vacaciones: { start: '2023-07-01', end: '2023-07-15' }, field_solicitante: 'user-6', field_responsable: 'user-1', field_estado: 'Approved' },

  // User 7 - Carmen Jiménez Torres
  { id: 'vac-17', field_rango_vacaciones: { start: '2023-02-20', end: '2023-02-28' }, field_solicitante: 'user-7', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-18', field_rango_vacaciones: { start: '2023-09-01', end: '2023-09-10' }, field_solicitante: 'user-7', field_responsable: 'user-2', field_estado: 'Pending' },
  { id: 'vac-19', field_rango_vacaciones: { start: '2023-11-15', end: '2023-11-20' }, field_solicitante: 'user-7', field_responsable: 'user-2', field_estado: 'Approved' },

  // User 8 - Pedro Sánchez Ruiz
  { id: 'vac-20', field_rango_vacaciones: { start: '2023-03-15', end: '2023-03-25' }, field_solicitante: 'user-8', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-21', field_rango_vacaciones: { start: '2023-08-10', end: '2023-08-20' }, field_solicitante: 'user-8', field_responsable: 'user-2', field_estado: 'Approved' },

  // User 9 - Isabel Hernández Castro
  { id: 'vac-22', field_rango_vacaciones: { start: '2023-04-01', end: '2023-04-10' }, field_solicitante: 'user-9', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-23', field_rango_vacaciones: { start: '2023-09-15', end: '2023-09-25' }, field_solicitante: 'user-9', field_responsable: 'user-2', field_estado: 'Pending' },
  { id: 'vac-24', field_rango_vacaciones: { start: '2023-12-01', end: '2023-12-10' }, field_solicitante: 'user-9', field_responsable: 'user-2', field_estado: 'Rejected' },

  // User 10 - Miguel Torres Vega
  { id: 'vac-25', field_rango_vacaciones: { start: '2023-05-10', end: '2023-05-20' }, field_solicitante: 'user-10', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-26', field_rango_vacaciones: { start: '2023-10-01', end: '2023-10-15' }, field_solicitante: 'user-10', field_responsable: 'user-2', field_estado: 'Approved' },

  // User 11 - Lucía Moreno Blanco
  { id: 'vac-27', field_rango_vacaciones: { start: '2023-06-01', end: '2023-06-12' }, field_solicitante: 'user-11', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-28', field_rango_vacaciones: { start: '2023-11-01', end: '2023-11-10' }, field_solicitante: 'user-11', field_responsable: 'user-1', field_estado: 'Pending' },

  // User 12 - Francisco Romero Gil
  { id: 'vac-29', field_rango_vacaciones: { start: '2023-01-20', end: '2023-01-30' }, field_solicitante: 'user-12', field_responsable: 'user-4', field_estado: 'Approved' },
  { id: 'vac-30', field_rango_vacaciones: { start: '2023-07-20', end: '2023-07-31' }, field_solicitante: 'user-12', field_responsable: 'user-4', field_estado: 'Approved' },
  { id: 'vac-31', field_rango_vacaciones: { start: '2023-12-15', end: '2023-12-25' }, field_solicitante: 'user-12', field_responsable: 'user-4', field_estado: 'Pending' },

  // User 13 - Rosa Navarro Ortiz
  { id: 'vac-32', field_rango_vacaciones: { start: '2023-02-15', end: '2023-02-25' }, field_solicitante: 'user-13', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-33', field_rango_vacaciones: { start: '2023-08-05', end: '2023-08-18' }, field_solicitante: 'user-13', field_responsable: 'user-2', field_estado: 'Approved' },

  // User 14 - Antonio Muñoz Prieto
  { id: 'vac-34', field_rango_vacaciones: { start: '2023-03-20', end: '2023-03-28' }, field_solicitante: 'user-14', field_responsable: 'user-2', field_estado: 'Approved' },
  { id: 'vac-35', field_rango_vacaciones: { start: '2023-09-10', end: '2023-09-20' }, field_solicitante: 'user-14', field_responsable: 'user-2', field_estado: 'Pending' },
  { id: 'vac-36', field_rango_vacaciones: { start: '2023-11-25', end: '2023-11-30' }, field_solicitante: 'user-14', field_responsable: 'user-2', field_estado: 'Rejected' },

  // User 15 - Elena Ruiz Méndez
  { id: 'vac-37', field_rango_vacaciones: { start: '2023-04-15', end: '2023-04-25' }, field_solicitante: 'user-15', field_responsable: 'user-11', field_estado: 'Approved' },
  { id: 'vac-38', field_rango_vacaciones: { start: '2023-10-05', end: '2023-10-18' }, field_solicitante: 'user-15', field_responsable: 'user-11', field_estado: 'Approved' },

  // User 16 - Jorge Díaz Santos
  { id: 'vac-39', field_rango_vacaciones: { start: '2023-05-15', end: '2023-05-25' }, field_solicitante: 'user-16', field_responsable: 'user-1', field_estado: 'Approved' },
  { id: 'vac-40', field_rango_vacaciones: { start: '2023-11-10', end: '2023-11-20' }, field_solicitante: 'user-16', field_responsable: 'user-1', field_estado: 'Pending' },

  // User 17 - Patricia Ortega Fernández
  { id: 'vac-41', field_rango_vacaciones: { start: '2023-06-10', end: '2023-06-20' }, field_solicitante: 'user-17', field_responsable: 'user-9', field_estado: 'Approved' },
  { id: 'vac-42', field_rango_vacaciones: { start: '2023-12-10', end: '2023-12-20' }, field_solicitante: 'user-17', field_responsable: 'user-9', field_estado: 'Pending' },
  { id: 'vac-43', field_rango_vacaciones: { start: '2023-09-20', end: '2023-09-25' }, field_solicitante: 'user-17', field_responsable: 'user-9', field_estado: 'Rejected' },

  // User 18 - Raúl Castro López
  { id: 'vac-44', field_rango_vacaciones: { start: '2023-01-25', end: '2023-02-05' }, field_solicitante: 'user-18', field_responsable: 'user-4', field_estado: 'Approved' },
  { id: 'vac-45', field_rango_vacaciones: { start: '2023-08-20', end: '2023-08-30' }, field_solicitante: 'user-18', field_responsable: 'user-4', field_estado: 'Approved' },

  // User 19 - Silvia Rubio Martín
  { id: 'vac-46', field_rango_vacaciones: { start: '2023-03-10', end: '2023-03-20' }, field_solicitante: 'user-19', field_responsable: 'user-11', field_estado: 'Approved' },
  { id: 'vac-47', field_rango_vacaciones: { start: '2023-07-25', end: '2023-08-05' }, field_solicitante: 'user-19', field_responsable: 'user-11', field_estado: 'Approved' },
  { id: 'vac-48', field_rango_vacaciones: { start: '2023-12-05', end: '2023-12-15' }, field_solicitante: 'user-19', field_responsable: 'user-11', field_estado: 'Pending' },

  // User 20 - Alberto Serrano Núñez
  { id: 'vac-49', field_rango_vacaciones: { start: '2023-02-05', end: '2023-02-12' }, field_solicitante: 'user-20', field_responsable: 'user-7', field_estado: 'Approved' },
  { id: 'vac-50', field_rango_vacaciones: { start: '2023-09-05', end: '2023-09-15' }, field_solicitante: 'user-20', field_responsable: 'user-7', field_estado: 'Pending' },
  { id: 'vac-51', field_rango_vacaciones: { start: '2023-11-20', end: '2023-11-28' }, field_solicitante: 'user-20', field_responsable: 'user-7', field_estado: 'Approved' },
];

const loadVacationsFromStorage = (): Vacation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar vacaciones desde localStorage:', error);
  }
  return [...initialVacations];
};

export const saveVacationsToStorage = (vacations: Vacation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vacations));
  } catch (error) {
    console.error('Error al guardar vacaciones en localStorage:', error);
  }
};

// eslint-disable-next-line prefer-const
export let vacations = loadVacationsFromStorage();
