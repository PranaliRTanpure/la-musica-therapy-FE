import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import type { CheckboxProps } from '@mui/material/Checkbox';

export interface AppCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
  label: string;
  /** Called with the next checked state. */
  onChange?: (checked: boolean) => void;
  /** Show the control + helper text in the error state. */
  error?: boolean;
  /** Message shown beneath the checkbox (typically a validation error). */
  helperText?: string;
}

/**
 * Base checkbox with a trailing label and optional error/helper text.
 * Form-agnostic and controlled by props (`checked` + `onChange(checked)`); the
 * RHF wrapping lives in `FormCheckbox`.
 */
export function AppCheckbox({
  label,
  checked,
  onChange,
  error,
  helperText,
  ...rest
}: AppCheckboxProps) {
  return (
    <FormControl error={error} variant="standard">
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checked}
            onChange={(event) => onChange?.(event.target.checked)}
            {...rest}
          />
        }
        label={label}
        slotProps={{ typography: { variant: 'body2' } }}
      />
      {helperText ? (
        <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
