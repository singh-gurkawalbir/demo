import React, { Fragment, useState, useCallback } from 'react';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

export default function ActionMenu({ actions, selectAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const renderActionMenu = ({ label, icon, component }) => {
    const handleActionClick = () => {
      selectAction(component);
    };

    return (
      <MenuItem key={label} onClick={handleActionClick}>
        {icon}
        {label}
      </MenuItem>
    );
  };

  if (!actions || !actions.length) return null;

  return (
    <Fragment>
      <IconButton
        data-test="openActionsMenu"
        aria-label="more"
        aria-controls={actionsPopoverId}
        aria-haspopup="true"
        size="small"
        onClick={handleMenuClick}>
        <EllipsisIcon />
      </IconButton>

      <Menu
        elevation={2}
        variant="menu"
        id={actionsPopoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}>
        {actions.map(a => renderActionMenu(a))}
      </Menu>
    </Fragment>
  );
}
