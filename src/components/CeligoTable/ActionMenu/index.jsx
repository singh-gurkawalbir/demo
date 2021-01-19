import React, { useState, useCallback, useMemo } from 'react';
import { IconButton, MenuItem, Menu, Tooltip } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

const Action = ({ label, Icon, disabledActionText, useHasAccess, actionProps, rowData, component, selectAction, handleMenuClose}) => {
  const handleActionClick = useCallback(() => {
    selectAction(component);
    handleMenuClose();
  }, [component, handleMenuClose, selectAction]);
  const hasAccess = useHasAccess({...actionProps, rowData });

  if (!hasAccess) {
    return null;
  }
  const disabledActionTitle = disabledActionText?.({ ...actionProps, rowData });
  const actionIcon = Icon ? <Icon /> : null;

  if (disabledActionTitle) {
    return (
      <Tooltip data-public key={label} title={disabledActionTitle} placement="bottom" >
        <div>
          <MenuItem disabled>
            {actionIcon}
            {label}
          </MenuItem>
        </div>
      </Tooltip>
    );
  }

  return (
    <MenuItem key={label} onClick={handleActionClick}>
      {actionIcon}
      {label}
    </MenuItem>
  );
};
export default function ActionMenu({ rowActions, rowData, actionProps, selectAction }) {
  const [anchorEl, setAnchorEl] = useState(null);
  // We are passing state to action items where each Action item would check if it has got permission.
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

  const actions = useMemo(() => {
    // rowActions may or may not be a fn. Sometimes
    // the actions are static, other times they are
    // determinant on the resource they apply to.
    // Check on this later for the scope of refactor
    const meta = typeof rowActions === 'function'
      ? rowActions(rowData, actionProps)
      : rowActions;

    return meta.map(({ icon, label, disabledActionText, useHasAccess, component: Action }) => ({
      Icon: icon,
      disabledActionText,
      selectAction,
      handleMenuClose,
      // if its not defined return true
      useHasAccess: useHasAccess || (() => true),
      rowData,
      actionProps,
      label:
      typeof label === 'function'
        ? label(rowData, actionProps)
        : label,
      component: <Action {...actionProps} rowData={rowData} />,
    }));
  }, [actionProps, handleMenuClose, rowActions, rowData, selectAction]);

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
        {actions.map(a => <Action key={a.label} {...a} />)}
      </Menu>
    </>
  );
}
