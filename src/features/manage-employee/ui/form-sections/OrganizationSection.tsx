import { FormRow } from "@/shared/ui/layout/FormRow";
import { SelectField } from "@/shared/ui/form-components/SelectField";
import {
  areas,
  departamentos,
  divisiones,
  businessUnits,
} from "@/shared/mock/catalogs";

interface OrganizationSectionProps {
  area: string;
  department: string;
  division: string;
  bu: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

/**
 * Sección de organización del empleado (área, departamento, división, BU)
 */
export const OrganizationSection = ({
  area,
  department,
  division,
  bu,
  errors,
  onChange,
}: OrganizationSectionProps) => {
  return (
    <>
      <FormRow>
        <SelectField
          label="Área"
          value={area}
          onChange={(value) => onChange("field_area", value)}
          options={areas}
          error={errors.field_area}
          name="field_area"
        />
        <SelectField
          label="Departamento"
          value={department}
          onChange={(value) => onChange("field_department", value)}
          options={departamentos}
          error={errors.field_department}
          name="field_department"
        />
      </FormRow>

      <FormRow>
        <SelectField
          label="División"
          value={division}
          onChange={(value) => onChange("field_division", value)}
          options={divisiones}
          error={errors.field_division}
          name="field_division"
        />
        <SelectField
          label="Business Unit"
          value={bu}
          onChange={(value) => onChange("field_bu", value)}
          options={businessUnits}
          error={errors.field_bu}
          name="field_bu"
        />
      </FormRow>
    </>
  );
};
