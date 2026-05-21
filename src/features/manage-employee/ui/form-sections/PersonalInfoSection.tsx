import { FormRow } from "@/shared/ui/layout/FormRow";
import { TextInput, SelectField } from "@/shared/ui/form-components";
import { oficinas } from "@/shared/mock/catalogs";
import type { RefObject } from "react";

interface PersonalInfoSectionProps {
  username?: string;
  email?: string;
  password?: string;
  name: string;
  surname: string;
  field_num_empleado?: string;
  oficina: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  firstFieldRef?: RefObject<HTMLInputElement | null>;
  isEditMode?: boolean;
}

/**
 * Sección de información personal del empleado
 */
export const PersonalInfoSection = ({
  username = "",
  email = "",
  password = "",
  name,
  surname,
  field_num_empleado = "",
  oficina,
  errors,
  onChange,
  firstFieldRef,
  isEditMode = false,
}: PersonalInfoSectionProps) => {
  return (
    <>
      <FormRow>
        <TextInput
          label="Nombre de Usuario"
          value={username}
          onChange={(value) => onChange("username", value)}
          error={errors.username}
          required
          name="username"
          inputRef={firstFieldRef}
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(value) => onChange("email", value)}
          error={errors.email}
          name="email"
        />
      </FormRow>
      <FormRow>
        <TextInput
          label="Contraseña"
          type="password"
          value={password}
          onChange={(value) => onChange("password", value)}
          error={errors.password}
          required={!isEditMode}
          placeholder={isEditMode ? "Dejar en blanco para mantener" : ""}
          name="password"
        />
        <TextInput
          label="Número de Empleado"
          value={field_num_empleado}
          onChange={(value) => onChange("field_num_empleado", value)}
          error={errors.field_num_empleado}
          required
          name="field_num_empleado"
        />
      </FormRow>
      <FormRow>
        <TextInput
          label="Nombre"
          value={name}
          onChange={(value) => onChange("name", value)}
          error={errors.name}
          required
          name="name"
        />
        <TextInput
          label="Apellidos"
          value={surname}
          onChange={(value) => onChange("surname", value)}
          error={errors.surname}
          required
          name="surname"
        />
      </FormRow>

      <FormRow>
        <SelectField
          label="Oficina"
          value={oficina}
          onChange={(value) => onChange("field_oficina", value)}
          options={oficinas}
          error={errors.field_oficina}
          name="field_oficina"
        />
        <div />
      </FormRow>
    </>
  );
};
