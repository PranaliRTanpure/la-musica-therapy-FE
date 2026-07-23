import { useId, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface ProspectActionsProps {
  /** Names the trigger and the menu for assistive tech. */
  prospectName: string;
  onScheduleTrial: () => void;
  onView: () => void;
  onEdit: () => void;
}

/**
 * Per-row kebab menu for the Prospects table. Each row owns its own anchor
 * element, so the menu is a component rather than page-level state keyed by
 * row id (see `LeadActions` for the pattern this follows).
 */
export function ProspectActions({
  prospectName,
  onScheduleTrial,
  onView,
  onEdit,
}: ProspectActionsProps) {
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
        aria-label={`Actions for ${prospectName}`}
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
        slotProps={{ list: { 'aria-label': `Actions for ${prospectName}` } }}
      >
        <MenuItem onClick={runAndClose(onScheduleTrial)}>
          <ListItemIcon>
            <CalendarTodayOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Schedule Trial" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
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
      </Menu>
    </>
  );
}
