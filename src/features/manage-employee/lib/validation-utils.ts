/**
 * Utilidades de validación para el formulario de empleados
 */

/**
 * Valida el formato del número de empleado
 * Formato esperado: XXXXXX donde XXXXXX son 6 dígitos
 */
export const validateEmployeeNumber = (value: string): boolean => {
  const employeeNumberRegex = /^\d{6}$/;
  return employeeNumberRegex.test(value);
};

/**
 * Valida la unicidad del email entre los empleados existentes
 */
export const validateEmailUniqueness = (
  email: string,
  existingEmails: string[],
  currentEmployeeId?: string
): boolean => {
  // Si estamos editando, excluir el email actual de la validación
  const emailsToCheck = currentEmployeeId 
    ? existingEmails.filter(e => e !== email)
    : existingEmails;
  
  return !emailsToCheck.includes(email.toLowerCase());
};

/**
 * Valida el formato de email
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
