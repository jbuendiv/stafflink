import { FormRow } from "@/shared/ui/layout/FormRow";
import { SelectField, MultiSelectField } from "@/shared/ui/form-components";
import type { EmployeeRole } from "@/entities/employee/model/types";

const AVAILABLE_ROLES: EmployeeRole[] = [
  "USUARIO_AUTENTICADO",
  "ADMINISTRADOR",
  "STAFF",
  "RESPONSABLE",
  "RESPONSABLE_STAFFING",
];

const ESTADO_OPTIONS = [
  { id: "activo", nombre: "Activo" },
  { id: "inactivo", nombre: "Inactivo" },
];

interface RolesSectionProps {
  roles: EmployeeRole[];
  estado: string;
  onChange: (field: string, value: unknown) => void;
}

/**
 * Sección de roles y estado del empleado
 */
export const RolesSection = ({ roles, estado, onChange }: RolesSectionProps) => {
  const rolesOptions = AVAILABLE_ROLES.map((role) => ({
    id: role,
    label: role,
  }));

  return (
    <FormRow>
      <MultiSelectField
        label="Roles"
        value={roles}
        onChange={(value) => onChange("roles", value)}
        options={rolesOptions}
      />
      <SelectField
        label="Estado"
        value={estado}
        onChange={(value) => onChange("field_estado_empleado", value)}
        options={ESTADO_OPTIONS}
      />
    </FormRow>
  );
};
