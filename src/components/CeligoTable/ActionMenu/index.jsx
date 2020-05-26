import React, { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

export default function ActionMenu({ actions, selectAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  // We are passing state to action items where each Action item would check if it has got permission.
  const state = useSelector(state => state);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const renderActionMenu = useCallback(
    ({ label, icon, hasAccess, actionProps, resource, component }) => {
      const handleActionClick = () => {
        selectAction(component);
      };

      if (hasAccess && !hasAccess({ state, ...actionProps, resource })) {
        return;
      }

      return (
        <MenuItem key={label} onClick={handleActionClick}>
          {icon}
          {label}
        </MenuItem>
      );
    },
    [selectAction, state]
  );

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
