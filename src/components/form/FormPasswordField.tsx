import { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import { AppTextField } from '@/components/common/AppTextField';
import type { AppTextFieldProps } from '@/components/common/AppTextField';

export interface FormPasswordFieldProps<T extends FieldValues> extends Omit<
  AppTextFieldProps,
  | 'name'
  | 'value'
  | 'onChange'
  | 'error'
  | 'helperText'
  | 'defaultValue'
  | 'type'
> {
  name: Path<T>;
  control: Control<T>;
}

/**
 * RHF adapter for `AppTextField` with a show/hide toggle for password input.
 */
export function FormPasswordField<T extends FieldValues>({
  name,
  control,
  slotProps,
  ...rest
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppTextField
          id={name.replace(/\./g, '-')}
          {...rest}
          {...field}
          type={visible ? 'text' : 'password'}
          value={field.value ?? ''}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps?.input,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {visible ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
