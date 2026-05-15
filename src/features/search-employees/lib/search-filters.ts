/**
 * Utilidades para filtrar empleados según criterios de búsqueda
 */

import type { Employee } from '@/entities/employee/model/types';
import type { AvailabilityResult } from '@/shared/lib/availability';

/**
 * Criterios de búsqueda para empleados
 */
export interface SearchCriteria {
  // Perfil profesional
  skills?: string[];
  idiomas?: string[];
  categoria?: string[];
  tipoCarrera?: string;
  area?: string;
  oficina?: string;
  
  // Disponibilidad
  minimumAvailability?: number; // horas libres mínimas
  
  // Texto libre
  searchText?: string;
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
    employee.field_tipo_carrera,
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
  
  // El empleado debe tener al menos una de las skills requeridas
  return requiredSkills.some((skill) => employee.skills?.includes(skill));
}

/**
 * Verifica si el empleado tiene los idiomas requeridos
 */
function hasRequiredLanguages(employee: Employee, requiredLanguages: string[]): boolean {
  if (!requiredLanguages || requiredLanguages.length === 0) return true;
  if (!employee.idiomas || employee.idiomas.length === 0) return false;
  
  // El empleado debe tener al menos uno de los idiomas requeridos
  return requiredLanguages.some((lang) => employee.idiomas?.includes(lang));
}

/**
 * Verifica si el empleado pertenece a las categorías requeridas
 */
function hasRequiredCategory(employee: Employee, requiredCategories: string[]): boolean {
  if (!requiredCategories || requiredCategories.length === 0) return true;
  if (!employee.field_categoria || employee.field_categoria.length === 0) return false;
  
  // El empleado debe tener al menos una de las categorías
  return requiredCategories.some((cat) => employee.field_categoria?.includes(cat));
}

/**
 * Calcula un score de match (0-100) basado en qué tan bien el empleado cumple los criterios
 */
function calculateMatchScore(employee: Employee, criteria: SearchCriteria): number {
  let score = 0;
  let totalCriteria = 0;
  
  // Skills match
  if (criteria.skills && criteria.skills.length > 0) {
    totalCriteria++;
    const matchingSkills = criteria.skills.filter((skill) =>
      employee.skills?.includes(skill)
    );
    score += (matchingSkills.length / criteria.skills.length) * 100;
  }
  
  // Language match
  if (criteria.idiomas && criteria.idiomas.length > 0) {
    totalCriteria++;
    const matchingLanguages = criteria.idiomas.filter((lang) =>
      employee.idiomas?.includes(lang)
    );
    if (matchingLanguages.length > 0) {
      score += (matchingLanguages.length / criteria.idiomas.length) * 100;
    }
  }
  
  // Category match
  if (criteria.categoria && criteria.categoria.length > 0) {
    totalCriteria++;
    const matchingCategories = criteria.categoria.filter((cat) =>
      employee.field_categoria?.includes(cat)
    );
    if (matchingCategories.length > 0) {
      score += (matchingCategories.length / criteria.categoria.length) * 100;
    }
  }
  
  // Career type exact match
  if (criteria.tipoCarrera) {
    totalCriteria++;
    if (employee.field_tipo_carrera === criteria.tipoCarrera) {
      score += 100;
    }
  }
  
  // Area match
  if (criteria.area) {
    totalCriteria++;
    if (employee.field_area === criteria.area) {
      score += 100;
    }
  }
  
  // Office match
  if (criteria.oficina) {
    totalCriteria++;
    if (employee.field_oficina === criteria.oficina) {
      score += 100;
    }
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
    // Filtros excluyentes (debe cumplir todos)
    if (!matchesSearchText(employee, criteria.searchText || '')) continue;
    if (!hasRequiredSkills(employee, criteria.skills || [])) continue;
    if (!hasRequiredLanguages(employee, criteria.idiomas || [])) continue;
    if (!hasRequiredCategory(employee, criteria.categoria || [])) continue;
    
    if (criteria.tipoCarrera && employee.field_tipo_carrera !== criteria.tipoCarrera) continue;
    if (criteria.area && employee.field_area !== criteria.area) continue;
    if (criteria.oficina && employee.field_oficina !== criteria.oficina) continue;
    
    // Disponibilidad
    const availability = availabilityMap?.get(employee.id);
    let averageAvailability = 0;
    
    if (availability && availability.length > 0) {
      // Calcular total de horas disponibles en el período
      const totalHorasDisponibles = availability.reduce(
        (sum, a) => sum + a.horasDisponibles,
        0
      );
      
      // Filtrar por horas libres mínimas si se especifica
      if (criteria.minimumAvailability && totalHorasDisponibles < criteria.minimumAvailability) {
        continue;
      }
      
      // Calcular promedio de disponibilidad para mostrar
      averageAvailability =
        availability.reduce((sum, a) => sum + a.porcentajeDisponible, 0) /
        availability.length;
    }
    
    // Calcular match score
    const matchScore = calculateMatchScore(employee, criteria);
    
    results.push({
      employee,
      availability,
      averageAvailability,
      matchScore,
    });
  }
  
  // Ordenar por match score descendente
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
    categoria: peticion.field_categoria,
    tipoCarrera: peticion.field_tipo_carrera,
    area: peticion.field_area,
    skills: peticion.field_skills,
    idiomas: peticion.field_idiomas ? [peticion.field_idiomas] : undefined,
    minimumAvailability,
  };
  
  return filterEmployees(employees, criteria, availabilityMap);
}
