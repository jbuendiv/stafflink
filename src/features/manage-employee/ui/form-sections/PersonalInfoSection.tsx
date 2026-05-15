import { FormRow } from "@/shared/ui/layout/FormRow";
import { TextInput, SelectField } from "@/shared/ui/form-components";
import { oficinas } from "@/shared/mock/catalogs";
import type { RefObject } from "react";

interface PersonalInfoSectionProps {
  name: string;
  surname: string;
  email: string;
  oficina: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  firstFieldRef?: RefObject<HTMLInputElement | null>;
}

/**
 * Sección de información personal del empleado
 */
export const PersonalInfoSection = ({
  name,
  surname,
  email,
  oficina,
  errors,
  onChange,
  firstFieldRef,
}: PersonalInfoSectionProps) => {
  return (
    <>
      <FormRow>
        <TextInput
          label="Nombre"
          value={name}
          onChange={(value) => onChange("name", value)}
          error={errors.name}
          required
          name="name"
          inputRef={firstFieldRef}
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
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(value) => onChange("email", value)}
          error={errors.email}
          required
          name="email"
        />
        <SelectField
          label="Oficina"
          value={oficina}
          onChange={(value) => onChange("field_oficina", value)}
          options={oficinas}
          error={errors.field_oficina}
          required
          name="field_oficina"
        />
      </FormRow>
    </>
  );
};
