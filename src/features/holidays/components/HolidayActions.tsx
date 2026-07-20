import { useId, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface HolidayActionsProps {
  /** Names the trigger and the menu for assistive tech. */
  holidayTitle: string;
  onEdit: () => void;
}

/**
 * Per-row kebab menu. Each row owns its own anchor element, so the menu is a
 * component rather than page-level state keyed by row id.
 */
export function HolidayActions({ holidayTitle, onEdit }: HolidayActionsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const open = Boolean(anchorEl);

  const handleEdit = () => {
    setAnchorEl(null);
    onEdit();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label={`Actions for ${holidayTitle}`}
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
        slotProps={{ list: { 'aria-label': `Actions for ${holidayTitle}` } }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
      </Menu>
    </>
  );
}
