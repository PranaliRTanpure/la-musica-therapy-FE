import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface RowActionItem {
  /** Unique key for the item within this menu. */
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Renders a divider above this item. */
  dividerBefore?: boolean;
}

export interface RowActionsMenuProps {
  /** Names the trigger and the menu for assistive tech, e.g. the row's title. */
  label: string;
  actions: RowActionItem[];
}

/**
 * Per-row kebab menu shared by table row actions (leads, prospects,
 * holidays, ...). Each row owns its own anchor element, so the menu is a
 * component rather than page-level state keyed by row id.
 */
export function RowActionsMenu({ label, actions }: RowActionsMenuProps) {
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
        aria-label={`Actions for ${label}`}
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
        slotProps={{ list: { 'aria-label': `Actions for ${label}` } }}
      >
        {actions.map((action) => [
          action.dividerBefore && (
            <Divider key={`${action.key}-divider`} sx={{ my: 0.5 }} />
          ),
          <MenuItem key={action.key} onClick={runAndClose(action.onClick)}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>,
        ])}
      </Menu>
    </>
  );
}
