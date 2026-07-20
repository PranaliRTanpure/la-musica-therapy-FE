import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

interface NameLinkProps {
  children: string;
  /** Router destination. When set, the name renders as a navigation link. */
  to?: string;
  /** Fallback click handler used when no `to` is provided. */
  onClick?: () => void;
}

/** The blue, clickable name shown in the first column of every data table. */
export function NameLink({ children, to, onClick }: NameLinkProps) {
  if (to) {
    return (
      <Link
        component={RouterLink}
        to={to}
        underline="hover"
        color="primary"
        sx={(theme) => ({
          fontWeight: theme.typography.fontWeightSemiBold,
          textAlign: 'left',
        })}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      color="primary"
      onClick={onClick}
      sx={(theme) => ({
        fontWeight: theme.typography.fontWeightSemiBold,
        textAlign: 'left',
      })}
    >
      {children}
    </Link>
  );
}
