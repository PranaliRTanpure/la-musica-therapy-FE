import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonTypeMap } from '@mui/material/Button';
import type { OverrideProps } from '@mui/material/OverridableComponent';
import type { ElementType } from 'react';

export type AppButtonProps<
  C extends ElementType = ButtonTypeMap['defaultComponent'],
> = OverrideProps<ButtonTypeMap<{ loading?: boolean }>, C> & {
  component?: C;
};

// Polymorphic via `component` (e.g. `component={RouterLink}` + `to`).
export function AppButton<
  C extends ElementType = ButtonTypeMap['defaultComponent'],
>({ loading, disabled, children, ...rest }: AppButtonProps<C>) {
  return (
    <Button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
      {children}
    </Button>
  );
}
