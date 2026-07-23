import { useId, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface LeadActionsProps {
  /** Names the trigger and the menu for assistive tech. */
  leadName: string;
  onView: () => void;
  onEdit: () => void;
  onResendLink: () => void;
}

/**
 * Per-row kebab menu for the Leads table. Each row owns its own anchor
 * element, so the menu is a component rather than page-level state keyed by
 * row id (see `HolidayActions` for the pattern this follows).
 */
export function LeadActions({
  leadName,
  onView,
  onEdit,
  onResendLink,
}: LeadActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const open = Boolean(anchorEl);

  const runAndClose = (action: () => void) => () => {
    setAnchorEl(null);
    action();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label={`Actions for ${leadName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-label': `Actions for ${leadName}` } }}
      >
        <MenuItem onClick={runAndClose(onView)}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View" />
        </MenuItem>
        <MenuItem onClick={runAndClose(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={runAndClose(onResendLink)}>
          <ListItemIcon>
            <SendOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Resend link" />
        </MenuItem>
      </Menu>
    </>
  );
}
