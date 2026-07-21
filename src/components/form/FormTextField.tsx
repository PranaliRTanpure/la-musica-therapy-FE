import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { AppTextField } from '@/components/common/AppTextField';
import type { AppTextFieldProps } from '@/components/common/AppTextField';

export interface FormTextFieldProps<T extends FieldValues> extends Omit<
  AppTextFieldProps,
  'name' | 'value' | 'onChange' | 'error' | 'helperText' | 'defaultValue'
> {
  name: Path<T>;
  control: Control<T>;
}

/**
 * RHF adapter for `AppTextField`: binds the base input to a form field via
 * `<Controller>` and surfaces validation errors as `helperText`.
 */
export function FormTextField<T extends FieldValues>({
  name,
  control,
  ...rest
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppTextField
          id={name.replace(/\./g, '-')}
          {...rest}
          {...field}
          value={field.value ?? ''}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
