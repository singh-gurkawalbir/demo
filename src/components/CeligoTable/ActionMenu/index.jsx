import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, MenuItem, Menu, Tooltip } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

export default function ActionMenu({ actions, selectAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  // We are passing state to action items where each Action item would check if it has got permission.
  const state = useSelector(state => state);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(
    event => {
      setAnchorEl(event.currentTarget);
      selectAction(undefined);
    },
    [selectAction]
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const renderActionMenu = useCallback(
    ({ label, icon, disabledActionText, hasAccess, actionProps, rowData, component }) => {
      const handleActionClick = () => {
        selectAction(component);
        handleMenuClose();
      };

      if (hasAccess && !hasAccess({ state, ...actionProps, rowData })) {
        return;
      }
      const disabledActionTitle = disabledActionText?.({ state, ...actionProps, rowData });

      return (
        disabledActionTitle
          ? (
            <Tooltip title={disabledActionTitle} placement="bottom" >
              <div>
                <MenuItem key={label} disabled>
                  {icon}
                  {label}
                </MenuItem>
              </div>
            </Tooltip>
          )
          : (
            <MenuItem key={label} onClick={handleActionClick}>
              {icon}
              {label}
            </MenuItem>
          )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectAction]
  );

  if (!actions || !actions.length) return null;

  return (
    <>
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
    </>
  );
}
