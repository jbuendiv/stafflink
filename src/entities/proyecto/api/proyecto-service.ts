import { Project } from '@/types';
import { MOCK_PROJECTS } from '@/data/mockData';

const STORAGE_KEY = 'stafflink_projects_v2';

export const proyectoService = {
  getAll: (): Project[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
    return MOCK_PROJECTS;
  },
  
  getById: (id: string): Project | undefined => {
    return proyectoService.getAll().find(p => p.id === id);
  },
  
  create: (project: Project): Project => {
    const projects = proyectoService.getAll();
    const newProject = { ...project, id: `project-new-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newProject, ...projects]));
    return newProject;
  },
  
  update: (id: string, updates: Partial<Project>): Project => {
    const projects = proyectoService.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proyecto no encontrado');
    
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects[index];
  },

  delete: (id: string): void => {
    const projects = proyectoService.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
};
