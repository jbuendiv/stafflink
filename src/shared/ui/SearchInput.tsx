import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { tokens } from '@/app/providers/styles/theme';

export interface SearchInputProps
  extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Show a clear button when the input has a value */
  clearable?: boolean;
}

/**
 * SearchInput
 *
 * A consistent, accessible search field with:
 * - Leading search icon
 * - Optional clear button
 * - Tokens-based styling
 *
 * @example
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Buscar empleados…"
 * />
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  clearable = true,
  sx,
  ...rest
}: SearchInputProps) {
  return (
    <TextField
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      slotProps={{
        input: {
          'aria-label': placeholder,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                aria-hidden="true"
                sx={{ fontSize: 18, color: tokens.text.muted }}
              />
            </InputAdornment>
          ),
          endAdornment:
            clearable && value ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onChange('')}
                  aria-label="Limpiar búsqueda"
                  size="small"
                  edge="end"
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
        },
      }}
      sx={{
        minWidth: { xs: '100%', sm: 260 },
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.radius.pill,
          bgcolor: tokens.surface.card,
          fontSize: tokens.fontSize.base,
          transition: `border-color ${tokens.animation.durationBase} ${tokens.animation.easing}`,
          '& fieldset': {
            borderColor: tokens.border.default,
          },
          '&:hover fieldset': {
            borderColor: tokens.border.strong,
          },
          '&.Mui-focused fieldset': {
            borderColor: tokens.brand.main,
            borderWidth: '1.5px',
          },
        },
        ...sx,
      }}
      {...rest}
    />
  );
}
