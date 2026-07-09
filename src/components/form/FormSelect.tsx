import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { AppSelect } from '@/components/common/AppSelect';
import type { AppSelectProps } from '@/components/common/AppSelect';

export interface FormSelectProps<T extends FieldValues> extends Omit<
  AppSelectProps,
  'name' | 'value' | 'onChange' | 'error' | 'helperText' | 'defaultValue'
> {
  name: Path<T>;
  control: Control<T>;
}

/**
 * RHF adapter for `AppSelect`: binds the base select to a form field via
 * `<Controller>` and surfaces validation errors as `helperText`.
 */
export function FormSelect<T extends FieldValues>({
  name,
  control,
  ...rest
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppSelect
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
