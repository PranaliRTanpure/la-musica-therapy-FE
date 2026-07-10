import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FileDropzone } from '@/components/common/FileDropzone';
import type { FileDropzoneProps } from '@/components/common/FileDropzone';

export interface FormFileDropzoneProps<T extends FieldValues> extends Omit<
  FileDropzoneProps,
  'onFilesSelected' | 'error' | 'helperText'
> {
  name: Path<T>;
  control: Control<T>;
}

/**
 * RHF adapter for `FileDropzone`: binds the selected `File[]` to a form field
 * and surfaces validation errors beneath the zone.
 */
export function FormFileDropzone<T extends FieldValues>({
  name,
  control,
  allowMultiple,
  ...rest
}: FormFileDropzoneProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FileDropzone
          {...rest}
          allowMultiple={allowMultiple}
          onFilesSelected={(files) => {
            const current: File[] = Array.isArray(field.value)
              ? field.value
              : [];
            field.onChange(allowMultiple ? [...current, ...files] : files);
          }}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
