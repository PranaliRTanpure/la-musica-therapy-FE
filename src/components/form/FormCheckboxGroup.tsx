import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { AppCheckbox } from '@/components/common/AppCheckbox';

export interface CheckboxGroupOption {
  label: string;
  value: string;
}

export interface FormCheckboxGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: CheckboxGroupOption[];
  /** MUI Grid2 `size` for each option cell. */
  itemSize?: { xs?: number; sm?: number; md?: number };
  disabled?: boolean;
}

/**
 * RHF adapter for a group of checkboxes bound to a `string[]` field: toggling an
 * option adds/removes its value. Keeps `<Controller>` in the adapter tier so
 * feature forms don't wire arrays by hand.
 */
export function FormCheckboxGroup<T extends FieldValues>({
  name,
  control,
  options,
  itemSize = { xs: 12, sm: 6, md: 3 },
  disabled,
}: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected: string[] = Array.isArray(field.value)
          ? field.value
          : [];
        const toggle = (value: string) =>
          field.onChange(
            selected.includes(value)
              ? selected.filter((v) => v !== value)
              : [...selected, value]
          );
        return (
          <Grid container spacing={1}>
            {options.map((option) => (
              <Grid key={option.value} size={itemSize}>
                <AppCheckbox
                  label={option.label}
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                  disabled={disabled}
                />
              </Grid>
            ))}
          </Grid>
        );
      }}
    />
  );
}
