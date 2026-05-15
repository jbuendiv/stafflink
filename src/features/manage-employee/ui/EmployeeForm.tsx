import { Box, Button, Typography, Paper, Stack, Alert, AlertTitle } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import type {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from "@/entities/employee/model/types";
import { useEmployeeForm } from "../hooks/useEmployeeForm";
import { 
  calculateEmployeeCompleteness,
  getCompletenessLabel 
} from "../lib/completeness-validator";
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

  // Calcular completitud
  const completeness = calculateEmployeeCompleteness(formData);
  // Mostrar advertencia de completitud si el score es menor a 100%
  const showCompletenessWarning = completeness.score < 100;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
      >
        {isEditMode ? "Editar Empleado" : "Crear Empleado"}
      </Typography>

      {/* Advertencia de completitud */}
      {showCompletenessWarning && (
        <Alert 
          severity={completeness.score >= 70 ? "warning" : "error"}
          icon={<InfoIcon />}
          sx={{ mt: 2 }}
        >
          <AlertTitle>
            <Typography variant="subtitle1" component="span">
              Ficha {getCompletenessLabel(completeness.score)} ({completeness.score}%)
            </Typography>
          </AlertTitle>
          {completeness.missingFields.length > 0 && (
            <Typography variant="body2">
              <strong>Campos faltantes:</strong> {completeness.missingFields.join(", ")}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {completeness.score < 70 
              ? "Este empleado no puede usarse correctamente en staffing, asignaciones y vacaciones hasta completar los datos requeridos."
              : "Completa los campos restantes para que el empleado esté disponible en todos los flujos del sistema."}
          </Typography>
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Stack spacing={3}>
          {/* Información personal */}
          <PersonalInfoSection
            name={formData.name}
            surname={formData.surname}
            email={formData.email}
            oficina={formData.field_oficina}
            errors={errors}
            onChange={handleChange}
            firstFieldRef={firstFieldRef}
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
            responsables={formData.field_responsables}
            skills={formData.skills}
            idiomas={formData.idiomas}
            showResponsable={shouldShowResponsable}
            onChange={handleChange}
            errors={errors}
          />

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              sx={{
                color: "error.main",
                borderColor: "error.main",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: "error.light",
                  color: "primary.contrastText",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              {isEditMode ? "Guardar Cambios" : "Crear Empleado"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
