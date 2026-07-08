import Link from '@mui/material/Link';

interface NameLinkProps {
  children: string;
  /**
   * Fired when the name is activated. Wire this to navigation once the API is
   * connected (e.g. a React Router `RouterLink` to `/clients/:id`); until then
   * it stays optional so the component is action-ready without a dead control.
   */
  onClick?: () => void;
}

/** The blue, clickable name shown in the first column of every Clients table. */
export function NameLink({ children, onClick }: NameLinkProps) {
  return (
    <Link
      component="button"
      type="button"
      underline="hover"
      color="primary"
      onClick={onClick}
      sx={{ fontWeight: 600, textAlign: 'left' }}
    >
      {children}
    </Link>
  );
}
