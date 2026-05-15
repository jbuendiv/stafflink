import type { Employee, CreateEmployeeDTO } from "@/entities/employee/model/types";

/**
 * Resultado de la validación de completitud
 */
export interface CompletenessResult {
  score: number; // 0-100
  missingFields: string[];
  isComplete: boolean;
}

/**
 * Tipo para datos de empleado (puede ser Employee completo o DTO)
 */
type EmployeeData = Employee | CreateEmployeeDTO;

/**
 * Configuración de campos y su peso en el score de completitud
 */
const FIELD_WEIGHTS = {
  // Datos básicos (40%)
  name: 10,
  surname: 10,
  email: 10,
  field_oficina: 10,
  
  // Organización (20%)
  field_area: 5,
  field_department: 5,
  field_division: 5,
  field_bu: 5,
  
  // Carrera (15%)
  field_categoria: 7.5,
  field_tipo_carrera: 7.5,
  
  // Skills e idiomas (15%)
  skills: 7.5,
  idiomas: 7.5,
  
  // Responsables (10%) - solo si aplica
  field_responsables: 10,
};

/**
 * Labels legibles para los campos
 */
const FIELD_LABELS: Record<string, string> = {
  name: "Nombre",
  surname: "Apellidos",
  email: "Email",
  field_oficina: "Oficina",
  field_area: "Área",
  field_department: "Departamento",
  field_division: "División",
  field_bu: "Business Unit",
  field_categoria: "Categoría",
  field_tipo_carrera: "Tipo de Carrera",
  skills: "Skills",
  idiomas: "Idiomas",
  field_responsables: "Responsables",
};

/**
 * Valida si un campo está completo
 */
const isFieldComplete = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Calcula la completitud de un empleado
 */
export const calculateEmployeeCompleteness = (
  employee: EmployeeData
): CompletenessResult => {
  const missingFields: string[] = [];
  let totalWeight = 0;
  let achievedWeight = 0;

  // Determinar si necesita responsable
  const isAdminOrResponsable =
    employee.roles.includes("ADMINISTRADOR") ||
    employee.roles.includes("RESPONSABLE");
  const needsResponsable = !isAdminOrResponsable;

  // Evaluar cada campo
  Object.entries(FIELD_WEIGHTS).forEach(([field, weight]) => {
    // Saltar responsables si no aplica
    if (field === "field_responsables" && !needsResponsable) {
      return;
    }

    totalWeight += weight;

    const value = employee[field as keyof EmployeeData];
    if (isFieldComplete(value)) {
      achievedWeight += weight;
    } else {
      missingFields.push(FIELD_LABELS[field] || field);
    }
  });

  const score = totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0;
  const isComplete = score === 100;

  return {
    score,
    missingFields,
    isComplete,
  };
};

/**
 * Obtiene el color según el score de completitud
 */
export const getCompletenessColor = (score: number): string => {
  if (score >= 90) return "success";
  if (score >= 70) return "warning";
  return "error";
};

/**
 * Obtiene el texto descriptivo según el score
 */
export const getCompletenessLabel = (score: number): string => {
  if (score === 100) return "Completo";
  if (score >= 90) return "Casi completo";
  if (score >= 70) return "Parcialmente completo";
  if (score >= 50) return "Incompleto";
  return "Muy incompleto";
};
