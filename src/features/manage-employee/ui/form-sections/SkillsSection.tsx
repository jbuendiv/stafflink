import { FormRow } from "@/shared/ui/layout/FormRow";
import { SearchableMultiSelectField } from "@/shared/ui/form-components";
import { skillsDisponibles, idiomasDisponibles } from "@/shared/mock/catalogs";
import { employeeService } from "@/entities/employee/api/employee-service";

interface SkillsSectionProps {
  responsables: string[];
  skills: string[];
  idiomas: string[];
  showResponsable: boolean;
  onChange: (field: string, value: unknown) => void;
  errors?: Record<string, string>;
}

/**
 * Sección de responsable, skills e idiomas del empleado
 */
export const SkillsSection = ({
  responsables,
  skills,
  idiomas,
  showResponsable,
  onChange,
  errors = {},
}: SkillsSectionProps) => {
  const responsablesDisponibles = employeeService.getAll().filter(
    (u) =>
      u.roles.includes("RESPONSABLE") || u.roles.includes("ADMINISTRADOR"),
  );

  const responsableOptions = responsablesDisponibles.map((resp) => ({
    id: resp.id,
    label: `${resp.name} ${resp.surname}`,
  }));

  const skillsOptions = skillsDisponibles.map((skill) => ({
    id: skill.id,
    label: skill.nombre,
  }));

  const idiomasOptions = idiomasDisponibles.map((idioma) => ({
    id: idioma.id,
    label: `${idioma.nombre} - ${idioma.nivel}`,
  }));

  return (
    <FormRow>
      {showResponsable && (
        <SearchableMultiSelectField
          label="Responsables"
          value={responsables}
          onChange={(value: string[]) => onChange("field_responsables", value)}
          options={responsableOptions}
          placeholder="Buscar responsable por nombre..."
          error={errors.field_responsables}
        />
      )}
      <SearchableMultiSelectField
        label="Skills"
        value={skills}
        onChange={(value: string[]) => onChange("skills", value)}
        options={skillsOptions}
        placeholder="Buscar skill..."
      />
      <SearchableMultiSelectField
        label="Idiomas"
        value={idiomas}
        onChange={(value: string[]) => onChange("idiomas", value)}
        options={idiomasOptions}
        placeholder="Buscar idioma..."
      />
    </FormRow>
  );
};
