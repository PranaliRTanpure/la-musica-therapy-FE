import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { OtpInput } from '@/components/common/OtpInput';
import type { OtpInputProps } from '@/components/common/OtpInput';

export interface FormOtpInputProps<T extends FieldValues> extends Omit<
  OtpInputProps,
  'value' | 'onChange' | 'error'
> {
  name: Path<T>;
  control: Control<T>;
}

/** RHF adapter for `OtpInput`: binds the base input to a form field via `<Controller>`. */
export function FormOtpInput<T extends FieldValues>({
  name,
  control,
  ...rest
}: FormOtpInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <OtpInput
          {...rest}
          id={name.replace(/\./g, '-')}
          value={field.value ?? ''}
          onChange={field.onChange}
          error={Boolean(fieldState.error)}
        />
      )}
    />
  );
}
