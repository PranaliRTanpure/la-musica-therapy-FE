import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { FieldLabel } from './FieldLabel';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'label'> {
  /** Label rendered above the field (not MUI's floating label). */
  label?: string;
  required?: boolean;
  /** Shows a search icon as the start adornment. */
  showSearchIcon?: boolean;
}

/**
 * Base text input: a themed MUI `TextField` with the project's top-label +
 * required-asterisk pattern. Form-agnostic and controlled by props — usable
 * standalone; the RHF `<Controller>` wrapping lives in `FormTextField`.
 * `ref` is forwarded to the underlying `TextField` for focus management.
 */
export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
  function AppTextField(
    { label, required, id, sx, showSearchIcon, slotProps, ...rest },
    ref
  ) {
    return (
      <Stack spacing={0.75}>
        {label ? (
          <FieldLabel htmlFor={id} label={label} required={required} />
        ) : null}
        <TextField
          ref={ref}
          id={id}
          required={required}
          slotProps={
            showSearchIcon
              ? {
                  ...slotProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    ...slotProps?.input,
                  },
                }
              : slotProps
          }
          sx={[
            (theme) => ({
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
              },
              // >=16px prevents iOS Safari from auto-zooming on focus.
              '& .MuiInputBase-input': {
                fontSize: theme.typography.body1.fontSize,
              },
            }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...rest}
        />
      </Stack>
    );
  }
);
