import { Box, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import type {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@/entities/employee/model/types";
import { useEmployeeForm } from "../hooks/useEmployeeForm";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { RolesSection } from "./form-sections/RolesSection";
import { OrganizationSection } from "./form-sections/OrganizationSection";
import { CareerSection } from "./form-sections/CareerSection";
import { SkillsSection } from "./form-sections/SkillsSection";


interface EmployeeFormProps {
  employee?: Employee | null;
  onSave: (data: CreateEmployeeDTO | UpdateEmployeeDTO) => void;
  onCancel: () => void;
}

/**
 * Formulario principal para crear/editar empleados
 * Refactorizado para separar la lógica (hook) de la presentación (componente)
 */
export const EmployeeForm = ({
  employee,
  onSave,
  onCancel,
}: EmployeeFormProps) => {
  const {
    formData,
    errors,
    firstFieldRef,
    isEditMode,
    shouldShowResponsable,
    handleChange,
    handleSubmit,
  } = useEmployeeForm({ employee, onSave, onCancel });

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Información personal */}
      <PersonalInfoSection
        username={formData.username}
        email={formData.email}
        password={formData.password}
        name={formData.name}
        surname={formData.surname}
        field_num_empleado={formData.field_num_empleado}
        oficina={formData.field_oficina}
        errors={errors}
        onChange={handleChange}
        firstFieldRef={firstFieldRef}
        isEditMode={isEditMode}
      />

      {/* Roles y estado */}
      <RolesSection
        roles={formData.roles}
        estado={formData.field_estado_empleado}
        onChange={handleChange}
      />

      {/* Organización */}
      <OrganizationSection
        area={formData.field_area}
        department={formData.field_department}
        division={formData.field_division}
        bu={formData.field_bu}
        errors={errors}
        onChange={handleChange}
      />

      {/* Carrera */}
      <CareerSection
        categoria={formData.field_categoria}
        tipoCarrera={formData.field_tipo_carrera}
        errors={errors}
        onChange={handleChange}
      />

      {/* Responsable, Skills e Idiomas */}
      <SkillsSection
        responsables={formData.field_responsables || []}
        skills={formData.skills || []}
        idiomas={formData.idiomas || []}
        showResponsable={shouldShowResponsable}
        onChange={handleChange}
        errors={errors}
      />

      {/* Botones de acción */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          pt: 2
        }}
      >
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={onCancel}
          color="inherit"
          sx={{
            borderRadius: '24px',
            textTransform: 'none'
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{ borderRadius: '24px', textTransform: 'none', boxShadow: 'none' }}
        >
          {isEditMode ? "Guardar Cambios" : "Crear Empleado"}
        </Button>
      </Box>
    </Box>
  );
};
