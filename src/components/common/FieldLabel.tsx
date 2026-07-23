import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface FieldLabelProps {
  label: string;
  /** Show the red required asterisk. */
  required?: boolean;
  htmlFor?: string;
}

/**
 * The bold field label rendered above an input, with an optional red asterisk
 * for required fields. Shared by the base `App*` inputs so every labelled field
 * looks identical.
 */
export function FieldLabel({ label, required, htmlFor }: FieldLabelProps) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      variant="bodyMedium"
      sx={{ color: 'text.primary' }}
    >
      {label}
      {required ? (
        <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>
          *
        </Box>
      ) : null}
    </Typography>
  );
}
