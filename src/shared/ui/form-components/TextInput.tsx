import { TextField } from "@mui/material";
import type { RefObject } from "react";

// Estilos para texto de error
const ERROR_HELPER_TEXT_SX = {
  color: "error.main",
  fontWeight: 600,
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  name?: string;
  type?: string;
  fullWidth?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

/**
 * Componente de input de texto genérico con manejo de errores
 */
export const TextInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  name,
  type = "text",
  fullWidth = true,
  inputRef,
}: TextInputProps) => {
  const displayLabel = required ? `${label} *` : label;

  return (
    <TextField
      fullWidth={fullWidth}
      label={displayLabel}
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      slotProps={{
        formHelperText: {
          sx: ERROR_HELPER_TEXT_SX,
        },
      }}
      inputRef={inputRef}
    />
  );
};
