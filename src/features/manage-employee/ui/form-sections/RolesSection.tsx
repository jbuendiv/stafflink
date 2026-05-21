import { FormRow } from "@/shared/ui/layout/FormRow";
import { SelectField } from "@/shared/ui/form-components/SelectField";
import { MultiSelectField } from "@/shared/ui/form-components/MultiSelectField";
import type { EmployeeRole } from "@/entities/employee/model/types";

const AVAILABLE_ROLES: { id: EmployeeRole, label: string }[] = [
  { id: "USUARIO_AUTENTICADO", label: "Usuario autenticado" },
  { id: "ADMINISTRADOR", label: "Administrador" },
  { id: "STAFF", label: "Staff" },
  { id: "RESPONSABLE", label: "Responsable" },
  { id: "RESPONSABLE_STAFFING", label: "Responsable Staffing" },
];

const ESTADO_OPTIONS = [
  { id: "inactivo", nombre: "Inactivo / Bloqueado" },
  { id: "activo", nombre: "Activo" },
];

interface RolesSectionProps {
  roles: EmployeeRole[];
  estado: string;
  onChange: (field: string, value: unknown) => void;
}

export const RolesSection = ({ roles, estado, onChange }: RolesSectionProps) => {
  return (
    <FormRow>
      <SelectField
        label="Estado"
        value={estado}
        onChange={(value) => onChange("field_estado_empleado", value)}
        options={ESTADO_OPTIONS}
        required
      />

      <MultiSelectField
        label="Roles"
        value={roles || []}
        onChange={(value) => onChange("roles", value)}
        options={AVAILABLE_ROLES}
      />
    </FormRow>
  );
};
