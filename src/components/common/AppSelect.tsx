import { forwardRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import type { SelectProps } from '@mui/material/Select';
import { FieldLabel } from './FieldLabel';

export interface AppSelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps extends Omit<
  TextFieldProps,
  'label' | 'select' | 'children'
> {
  label?: string;
  required?: boolean;
  options: AppSelectOption[];
  /** Muted text shown when no value is selected. */
  placeholder?: string;
}

/**
 * Base select input: a themed MUI `TextField select` with the top-label pattern
 * and a muted placeholder when empty. Form-agnostic and controlled by props;
 * the RHF wrapping lives in `FormSelect`. `ref` is forwarded to the underlying
 * `TextField` for focus management.
 */
export const AppSelect = forwardRef<HTMLDivElement, AppSelectProps>(
  function AppSelect(
    {
      label,
      required,
      options,
      placeholder = 'Select',
      id,
      value,
      sx,
      slotProps,
      ...rest
    },
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
          select
          required={required}
          value={value ?? ''}
          // Merge caller slotProps but always keep `displayEmpty` so the
          // placeholder MenuItem stays visible when the value is empty.
          // `displayEmpty` is spread last so the enforced value always wins.
          slotProps={{
            ...slotProps,
            select: {
              ...(slotProps?.select as Partial<SelectProps>),
              displayEmpty: true,
            },
          }}
          sx={[
            (theme) => ({
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
              },
              '& .MuiInputBase-input': {
                fontSize: theme.typography.body1.fontSize,
              },
            }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...rest}
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    );
  }
);
