import { FormRow } from "@/shared/ui/layout/FormRow";
import { SelectField } from "@/shared/ui/form-components/SelectField";
import { categorias, tiposCarrera } from "@/shared/mock/catalogs";

interface CareerSectionProps {
  categoria: string;
  tipoCarrera: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

/**
 * Sección de carrera profesional del empleado
 */
export const CareerSection = ({
  categoria,
  tipoCarrera,
  errors,
  onChange,
}: CareerSectionProps) => {
  return (
    <FormRow>
      <SelectField
        label="Categoría"
        value={categoria}
        onChange={(value) => onChange("field_categoria", value)}
        options={categorias}
        error={errors.field_categoria}
        required
        name="field_categoria"
      />
      <SelectField
        label="Tipo Carrera"
        value={tipoCarrera}
        onChange={(value) => onChange("field_tipo_carrera", value)}
        options={tiposCarrera}
        error={errors.field_tipo_carrera}
        required
        name="field_tipo_carrera"
      />
    </FormRow>
  );
};
