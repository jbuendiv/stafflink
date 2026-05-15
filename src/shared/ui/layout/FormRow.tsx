import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface FormRowProps {
  children: ReactNode;
}

/**
 * Componente contenedor para filas del formulario con layout responsivo
 */
export const FormRow = ({ children }: FormRowProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
};
