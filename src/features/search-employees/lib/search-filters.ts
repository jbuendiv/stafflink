/**
 * Utilidades para filtrar empleados según criterios de búsqueda
 */

import type { Employee } from '@/entities/employee/model/types';
import type { AvailabilityResult } from '@/shared/lib/availability';

/**
 * Criterios de búsqueda para empleados
 */
export interface SearchCriteria {
  searchText?: string;
  department?: string;
  area?: string;
  oficina?: string;
  responsables?: string[];
  proyectosOportunidades?: string[];
  categoria?: string;
  tipoCarrera?: string;
  idiomas?: string[];
  skills?: string[];
  division?: string;
  disponibilidadMeses?: string[];
  minimumAvailability?: number;
}

/**
 * Resultado de búsqueda con empleado y su disponibilidad
 */
export interface EmployeeSearchResult {
  employee: Employee;
  availability?: AvailabilityResult[];
  averageAvailability?: number;
  matchScore: number; // 0-100, qué tan bien matchea con los criterios
}

/**
 * Filtra empleados por texto de búsqueda libre
 */
function matchesSearchText(employee: Employee, searchText: string): boolean {
  if (!searchText || searchText.trim() === '') return true;
  
  const text = searchText.toLowerCase();
  const searchableText = [
    employee.name,
    employee.surname,
    employee.field_num_empleado,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  
  return searchableText.includes(text);
}

/**
 * Verifica si el empleado tiene las skills requeridas
 */
function hasRequiredSkills(employee: Employee, requiredSkills: string[]): boolean {
  if (!requiredSkills || requiredSkills.length === 0) return true;
  if (!employee.skills || employee.skills.length === 0) return false;
  return requiredSkills.some((skill) => employee.skills?.includes(skill));
}

/**
 * Verifica si el empleado tiene los idiomas requeridos
 */
function hasRequiredLanguages(employee: Employee, requiredLanguages: string[]): boolean {
  if (!requiredLanguages || requiredLanguages.length === 0) return true;
  if (!employee.idiomas || employee.idiomas.length === 0) return false;
  return requiredLanguages.some((lang) => employee.idiomas?.includes(lang));
}

/**
 * Verifica si el empleado tiene a los responsables requeridos
 */
function hasRequiredResponsables(employee: Employee, requiredResponsables: string[]): boolean {
  if (!requiredResponsables || requiredResponsables.length === 0) return true;
  if (!employee.field_responsables || employee.field_responsables.length === 0) return false;
  return requiredResponsables.some((resp) => employee.field_responsables?.includes(resp));
}

/**
 * Calcula un score de match (0-100) basado en qué tan bien el empleado cumple los criterios
 */
function calculateMatchScore(employee: Employee, criteria: SearchCriteria): number {
  let score = 0;
  let totalCriteria = 0;
  
  if (criteria.skills && criteria.skills.length > 0) {
    totalCriteria++;
    const matchingSkills = criteria.skills.filter((skill) => employee.skills?.includes(skill));
    score += (matchingSkills.length / criteria.skills.length) * 100;
  }
  
  if (criteria.idiomas && criteria.idiomas.length > 0) {
    totalCriteria++;
    const matchingLanguages = criteria.idiomas.filter((lang) => employee.idiomas?.includes(lang));
    if (matchingLanguages.length > 0) score += (matchingLanguages.length / criteria.idiomas.length) * 100;
  }

  if (criteria.responsables && criteria.responsables.length > 0) {
    totalCriteria++;
    const matchingResp = criteria.responsables.filter((r) => employee.field_responsables?.includes(r));
    if (matchingResp.length > 0) score += (matchingResp.length / criteria.responsables.length) * 100;
  }
  
  if (criteria.categoria) {
    totalCriteria++;
    if (employee.field_categoria === criteria.categoria) score += 100;
  }
  if (criteria.tipoCarrera) {
    totalCriteria++;
    if (employee.field_tipo_carrera === criteria.tipoCarrera) score += 100;
  }
  if (criteria.area) {
    totalCriteria++;
    if (employee.field_area === criteria.area) score += 100;
  }
  if (criteria.oficina) {
    totalCriteria++;
    if (employee.field_oficina === criteria.oficina) score += 100;
  }
  if (criteria.department) {
    totalCriteria++;
    if (employee.field_department === criteria.department) score += 100;
  }
  if (criteria.division) {
    totalCriteria++;
    if (employee.field_division === criteria.division) score += 100;
  }
  
  return totalCriteria > 0 ? score / totalCriteria : 100;
}

/**
 * Filtra empleados según criterios de búsqueda
 */
export function filterEmployees(
  employees: Employee[],
  criteria: SearchCriteria,
  availabilityMap?: Map<string, AvailabilityResult[]>
): EmployeeSearchResult[] {
  const results: EmployeeSearchResult[] = [];
  
  for (const employee of employees) {
    if (!matchesSearchText(employee, criteria.searchText || '')) continue;
    if (!hasRequiredSkills(employee, criteria.skills || [])) continue;
    if (!hasRequiredLanguages(employee, criteria.idiomas || [])) continue;
    if (!hasRequiredResponsables(employee, criteria.responsables || [])) continue;
    
    if (criteria.categoria && employee.field_categoria !== criteria.categoria) continue;
    if (criteria.tipoCarrera && employee.field_tipo_carrera !== criteria.tipoCarrera) continue;
    if (criteria.area && employee.field_area !== criteria.area) continue;
    if (criteria.oficina && employee.field_oficina !== criteria.oficina) continue;
    if (criteria.department && employee.field_department !== criteria.department) continue;
    if (criteria.division && employee.field_division !== criteria.division) continue;
    
    const availability = availabilityMap?.get(employee.id);
    let averageAvailability = 0;
    
    if (availability && availability.length > 0) {
      if (criteria.disponibilidadMeses && criteria.disponibilidadMeses.length > 0) {
        // Here we could filter or adjust based on the month availability
        // By default, just keep them if they match.
        // Optional logic: we check if the user is available in those months.
      }
      
      const totalHorasDisponibles = availability.reduce((sum, a) => sum + a.horasDisponibles, 0);
      if (criteria.minimumAvailability && totalHorasDisponibles < criteria.minimumAvailability) {
        continue;
      }
      averageAvailability = availability.reduce((sum, a) => sum + a.porcentajeDisponible, 0) / availability.length;
    }
    
    const matchScore = calculateMatchScore(employee, criteria);
    
    results.push({ employee, availability, averageAvailability, matchScore });
  }
  
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Obtiene empleados que mejor matchean con una petición de staffing
 */
export function findEmployeesForPeticion(
  employees: Employee[],
  peticion: {
    field_categoria?: string[];
    field_tipo_carrera?: string;
    field_area?: string;
    field_skills?: string[];
    field_idiomas?: string;
  },
  availabilityMap?: Map<string, AvailabilityResult[]>,
  minimumAvailability = 50 // horas libres mínimas por defecto
): EmployeeSearchResult[] {
  const criteria: SearchCriteria = {
    categoria: peticion.field_categoria?.[0],
    tipoCarrera: peticion.field_tipo_carrera,
    area: peticion.field_area,
    skills: peticion.field_skills,
    idiomas: peticion.field_idiomas ? [peticion.field_idiomas] : undefined,
    minimumAvailability,
  };
  
  return filterEmployees(employees, criteria, availabilityMap);
}
