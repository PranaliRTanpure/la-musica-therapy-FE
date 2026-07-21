import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { AppCheckbox } from '@/components/common/AppCheckbox';
import type { AppCheckboxProps } from '@/components/common/AppCheckbox';

export interface FormCheckboxProps<T extends FieldValues> extends Omit<
  AppCheckboxProps,
  'name' | 'checked' | 'onChange'
> {
  name: Path<T>;
  control: Control<T>;
}

/**
 * RHF adapter for `AppCheckbox`: binds a boolean form field via `<Controller>`.
 */
export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  ...rest
}: FormCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppCheckbox
          {...rest}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
