/**
 * Utilidades para formularios de empleados
 */

// Estilos compartidos
export const ERROR_HELPER_TEXT_SX = {
  color: "error.main",
  fontWeight: 600,
};

// Configuración de validación de campos
export interface FieldValidationConfig {
  required?: boolean;
  requiredMessage?: string;
  email?: boolean;
  emailMessage?: string;
}

// Validar un campo según su configuración
export const validateField = (
  value: unknown,
  config: FieldValidationConfig,
): string | null => {
  const stringValue = String(value || "").trim();

  if (config.required && !stringValue) {
    return config.requiredMessage || "Este campo es obligatorio";
  }

  if (config.email && stringValue && !stringValue.includes("@")) {
    return config.emailMessage || "Email inválido";
  }

  return null;
};

// Configuración de validación para campos de empleado
// Solo campos críticos son obligatorios para guardar
// El sistema de completitud indicará qué campos faltan para uso completo
export const EMPLOYEE_FIELD_VALIDATIONS: Record<
  string,
  FieldValidationConfig
> = {
  name: {
    required: true,
    requiredMessage: "El nombre es obligatorio",
  },
  surname: {
    required: true,
    requiredMessage: "Los apellidos son obligatorios",
  },
  email: {
    required: true,
    requiredMessage: "El email es obligatorio",
    email: true,
    emailMessage: "Email inválido",
  },
  field_oficina: {
    required: true,
    requiredMessage: "La oficina es obligatoria (necesaria para calendario y capacidad)",
  },
  field_responsable: {
    required: false,
  },
  // Los siguientes campos no son obligatorios para guardar,
  // pero el sistema de completitud advertirá si faltan
  field_area: {
    required: false,
  },
  field_department: {
    required: false,
  },
  field_division: {
    required: false,
  },
  field_bu: {
    required: false,
  },
  field_categoria: {
    required: false,
  },
  field_tipo_carrera: {
    required: false,
  },
};
