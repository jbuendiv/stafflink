import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

// Estilos para texto de error
const ERROR_HELPER_TEXT_SX = {
  color: "error.main",
  fontWeight: 600,
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; nombre: string }>;
  error?: string;
  required?: boolean;
  name?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

/**
 * Componente select genérico con manejo de errores
 */
export const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  name,
  fullWidth = true,
  size,
}: SelectFieldProps) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <FormControl fullWidth={fullWidth} error={!!error} size={size}>
      <InputLabel>{displayLabel}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={displayLabel}
        name={name}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.nombre}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <FormHelperText sx={ERROR_HELPER_TEXT_SX}>{error}</FormHelperText>
      )}
    </FormControl>
  );
};
