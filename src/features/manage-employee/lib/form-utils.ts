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
  pattern?: RegExp;
  patternMessage?: string;
}

// Validar un campo según su configuración
export const validateField = (
  value: unknown,
  config: FieldValidationConfig,
): string | null => {
  const stringValue = String(value || "").trim();

  if (config.required) {
    if (Array.isArray(value) && value.length === 0) {
      return config.requiredMessage || "Este campo es obligatorio";
    }
    if (!stringValue) {
      return config.requiredMessage || "Este campo es obligatorio";
    }
  }

  if (config.email && stringValue && !stringValue.includes("@")) {
    return config.emailMessage || "Email inválido";
  }

  if (config.pattern && stringValue && !config.pattern.test(stringValue)) {
    return config.patternMessage || "Formato inválido";
  }

  return null;
};

// Configuración de validación para campos de empleado
export const EMPLOYEE_FIELD_VALIDATIONS: Record<
  string,
  FieldValidationConfig
> = {
  username: {
    required: true,
    requiredMessage: "El nombre de usuario es obligatorio",
  },
  password: {
    required: true,
    requiredMessage: "La contraseña es obligatoria",
  },
  name: {
    required: true,
    requiredMessage: "El nombre es obligatorio",
  },
  surname: {
    required: true,
    requiredMessage: "Los apellidos son obligatorios",
  },
  field_num_empleado: {
    required: true,
    requiredMessage: "El número de empleado es obligatorio",
    pattern: /^\d{6}$/,
    patternMessage: "Debe tener exactamente 6 dígitos numéricos",
  },
  field_categoria: {
    required: false,
  },
  field_bu: {
    required: false,
  },
  field_division: {
    required: false,
  },
  field_department: {
    required: false,
  },
  field_area: {
    required: false,
  },
  idiomas: {
    required: false,
  },
  field_oficina: {
    required: false,
  },
  // Opcionales que de igual forma pueden tener reglas ad hoc si se requieren
  email: {
    required: false,
    email: true,
    emailMessage: "Email inválido",
  },
};
