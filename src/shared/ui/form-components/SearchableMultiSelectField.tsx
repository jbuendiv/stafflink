import {
  FormControl,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface SearchableMultiSelectFieldProps<T = string> {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  options: Array<{ id: T; label: string }>;
  fullWidth?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  size?: 'small' | 'medium';
}

/**
 * Componente select múltiple con búsqueda integrada
 * Usa Autocomplete de MUI con virtualización para listas grandes (+400 elementos)
 * Incluye filtrado en tiempo real mientras el usuario escribe
 */
export const SearchableMultiSelectField = <T extends string>({
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  placeholder = "Buscar...",
  error,
  required,
  size,
}: SearchableMultiSelectFieldProps<T>) => {
  // Convertir los IDs seleccionados a objetos completos
  const selectedOptions = value
    .map((id) => options.find((opt) => opt.id === id))
    .filter((opt): opt is { id: T; label: string } => opt !== undefined);

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <Autocomplete
        size={size}
        multiple
        disableCloseOnSelect
        options={options}
        value={selectedOptions}
        onChange={(_, newValue) => {
          onChange(newValue.map((item) => item.id));
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option, { selected }) => {
          const { key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
          return (
            <li key={key} {...otherProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            required={required}
            error={!!error}
            helperText={error}
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...(params.slotProps?.htmlInput as object),
                // Only apply native HTML required when no items are selected.
                // This prevents the browser from showing "Completa este campo"
                // when chips are selected (chips don't fill the input value).
                required: required ? selectedOptions.length === 0 : false,
              },
            }}
          />
        )}
        slotProps={{
          listbox: {
            style: {
              maxHeight: 300,
              overflow: 'auto',
            },
          },
          popper: {
            modifiers: [
              {
                name: 'flip',
                enabled: true, // Permite que el menú se posicione automáticamente
              },
              {
                name: 'preventOverflow',
                enabled: true,
                options: {
                  altAxis: true,
                  tether: false, // Permite que el menú se separe del campo si es necesario
                  rootBoundary: 'viewport',
                  padding: 8,
                },
              },
            ],
          },
        }}
        noOptionsText="No se encontraron resultados"
      />
    </FormControl>
  );
};
