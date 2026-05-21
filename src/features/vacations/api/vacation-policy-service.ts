import { OfficeVacation } from '@/types';
import { MOCK_OFFICE_VACATIONS } from '@/data/mockData';

const STORAGE_KEY = 'stafflink_vacation_policies';

export const vacationPolicyService = {
  getAll: (): OfficeVacation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with mock data if nowhere else
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_OFFICE_VACATIONS));
      return MOCK_OFFICE_VACATIONS;
    } catch (error) {
      console.error('Error parsing vacation policies from localStorage:', error);
      return MOCK_OFFICE_VACATIONS;
    }
  },

  getById: (id: string): OfficeVacation | undefined => {
    return vacationPolicyService.getAll().find(v => v.id === id);
  },

  create: (data: Omit<OfficeVacation, 'id'>): OfficeVacation => {
    const policies = vacationPolicyService.getAll();
    const newPolicy: OfficeVacation = {
      ...data,
      id: `vac-${Date.now()}`
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...policies, newPolicy]));
    return newPolicy;
  },

  update: (id: string, data: Partial<OfficeVacation>): OfficeVacation | null => {
    const policies = vacationPolicyService.getAll();
    const index = policies.findIndex(v => v.id === id);
    if (index === -1) return null;

    const updatedPolicy = { ...policies[index], ...data };
    policies[index] = updatedPolicy;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
    return updatedPolicy;
  },

  delete: (id: string): void => {
    const policies = vacationPolicyService.getAll().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
  }
};
