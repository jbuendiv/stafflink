import { useState, useEffect, useRef } from "react";
import type {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@/entities/employee/model/types";
import { employeeService } from "@/entities/employee/api/employee-service";
import {
  EMPLOYEE_FIELD_VALIDATIONS,
  validateField,
} from "../lib/form-utils";
import { 
  validateEmailFormat, 
  validateEmailUniqueness 
} from "../lib/validation-utils";

interface UseEmployeeFormProps {
  employee?: Employee | null;
  onSave: (data: CreateEmployeeDTO | UpdateEmployeeDTO) => void;
  onCancel: () => void;
}

/**
 * Hook personalizado que maneja toda la lógica del formulario de empleados
 */
export const useEmployeeForm = ({
  employee,
  onSave,
  onCancel,
}: UseEmployeeFormProps) => {
  const isEditMode = !!employee;
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<CreateEmployeeDTO>({
    username: employee?.username || "",
    password: "",
    name: employee?.name || "",
    surname: employee?.surname || "",
    field_num_empleado: employee?.field_num_empleado || "",
    email: employee?.email || "",
    roles: employee?.roles || ["USUARIO_AUTENTICADO"],
    field_estado_empleado: employee?.field_estado_empleado || "Activo",
    field_oficina: employee?.field_oficina || "",
    field_area: employee?.field_area || "",
    field_department: employee?.field_department || "",
    field_division: employee?.field_division || "",
    field_bu: employee?.field_bu || "",
    field_categoria: employee?.field_categoria || "",
    field_tipo_carrera: employee?.field_tipo_carrera || "",
    skills: employee?.skills || [],
    idiomas: employee?.idiomas || [],
    field_responsables: employee?.field_responsables || [],
    field_fecha_ultima_revision_ann: employee?.field_fecha_ultima_revision_ann || "",
    field_cv: employee?.field_cv || "",
    field_preferencias: employee?.field_preferencias || "",
    field_incompatibilidades: employee?.field_incompatibilidades || "",
    field_fecha_fin_asignacion_act: employee?.field_fecha_fin_asignacion_act || "",
    user_picture: employee?.user_picture || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username || "",
        password: "",
        name: employee.name || "",
        surname: employee.surname || "",
        field_num_empleado: employee.field_num_empleado || "",
        email: employee.email || "",
        roles: employee.roles || ["USUARIO_AUTENTICADO"],
        field_estado_empleado: employee.field_estado_empleado || "activo",
        field_oficina: employee.field_oficina || "",
        field_area: employee.field_area || "",
        field_department: employee.field_department || "",
        field_division: employee.field_division || "",
        field_bu: employee.field_bu || "",
        field_categoria: employee.field_categoria || "",
        field_tipo_carrera: employee.field_tipo_carrera || "",
        skills: employee.skills || [],
        idiomas: employee.idiomas || [],
        field_responsables: employee.field_responsables || [],
        field_fecha_ultima_revision_ann: employee.field_fecha_ultima_revision_ann || "",
        field_cv: employee.field_cv || "",
        field_preferencias: employee.field_preferencias || "",
        field_incompatibilidades: employee.field_incompatibilidades || "",
        field_fecha_fin_asignacion_act: employee.field_fecha_fin_asignacion_act || "",
        user_picture: employee.user_picture || "",
      });
    }
  }, [employee]);

  // Lógica de negocio: ¿mostrar campo de responsable?
  const isAdminOrResponsable =
    formData.roles.includes("ADMINISTRADOR") ||
    formData.roles.includes("RESPONSABLE");
  const shouldShowResponsable = !isAdminOrResponsable;

  // AutoFocus en el primer campo
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos usando las configuraciones
    Object.keys(EMPLOYEE_FIELD_VALIDATIONS).forEach((fieldName) => {
      const config = EMPLOYEE_FIELD_VALIDATIONS[fieldName];
      
      // La contraseña no es obligatoria en modo edición
      if (fieldName === "password" && isEditMode) {
        return;
      }

      // El responsable solo es obligatorio si no es ADMIN o RESPONSABLE
      if (fieldName === "field_responsable" && !shouldShowResponsable) {
        return;
      }

      // Mapear field_responsable a field_responsables en formData
      const formFieldName = fieldName === "field_responsable" ? "field_responsables" : fieldName;
      const value = formData[formFieldName as keyof CreateEmployeeDTO];
      
      const error = validateField(value, config);

      if (error) {
        // Usar el nombre del campo en formData para el error
        newErrors[formFieldName] = error;
      }
    });

    // Validación de unicidad del número de empleado
    if (formData.field_num_empleado) {
      const allEmployees = employeeService.getAll();
      const isDuplicateNum = allEmployees.some(
        emp => emp.field_num_empleado === formData.field_num_empleado && emp.id !== employee?.id
      );
      if (isDuplicateNum) {
        newErrors.field_num_empleado = "Este número de empleado ya está en uso";
      }
    }

    // Validaciones adicionales para email
    if (formData.email) {
      if (!validateEmailFormat(formData.email)) {
        newErrors.email = "Formato de email inválido";
      } else {
        // Usar datos dinámicos del servicio (incluye empleados creados en tiempo de ejecución)
        const allEmployees = employeeService.getAll();
        const existingEmails = allEmployees.map(emp => emp.email?.toLowerCase() ?? '');
        const currentEmail = employee?.email?.toLowerCase();
        
        if (!validateEmailUniqueness(formData.email, existingEmails, currentEmail)) {
          newErrors.email = "Este email ya está en uso por otro empleado";
        }
      }
    }

    setErrors(newErrors);

    // Focus en el primer campo con error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      ) as HTMLElement;
      errorElement?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // Manejo del submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let payload = { ...formData };
    // Si estamos editando y no se ha introducido nueva contraseña, no la mandamos
    if (isEditMode && !payload.password) {
      delete (payload as any).password;
    }

    onSave(payload as CreateEmployeeDTO | UpdateEmployeeDTO);
  };

  // Manejo de cambios en los campos
  const handleChange = (field: string, value: unknown) => {
    setFormData((prev: CreateEmployeeDTO) => ({ ...prev, [field]: value }));
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return {
    // Estado
    formData,
    errors,
    isEditMode,
    shouldShowResponsable,
    firstFieldRef,

    // Funciones
    handleSubmit,
    handleChange,
    handleCancel: onCancel,
  };
};
