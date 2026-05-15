import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";

interface MultiSelectFieldProps<T = string> {
  label: string;
  value: T[];
  onChange: (value: T[]) => void;
  options: Array<{ id: T; label: string }>;
  fullWidth?: boolean;
  renderChip?: (item: T, label: string) => string;
}

/**
 * Componente select múltiple genérico con chips
 */
export const MultiSelectField = <T extends string>({
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  renderChip,
}: MultiSelectFieldProps<T>) => {
  const getLabelById = (id: T): string => {
    const option = options.find((opt) => opt.id === id);
    return option?.label || String(id);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value as T[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((item) => {
              const itemLabel = getLabelById(item);
              const chipLabel = renderChip
                ? renderChip(item, itemLabel)
                : itemLabel;
              return <Chip key={item} label={chipLabel} size="small" />;
            })}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <Checkbox checked={value.includes(option.id)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
