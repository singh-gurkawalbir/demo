import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, MenuItem, Menu, Tooltip } from '@material-ui/core';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';

export default function ActionMenu({ rowActions, rowData, actionProps, selectAction }) {
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
    ({ label, Icon, disabledActionText, hasAccess, actionProps, rowData, component }) => {
      const handleActionClick = () => {
        selectAction(component);
        handleMenuClose();
      };

      if (hasAccess && !hasAccess({ state, ...actionProps, rowData })) {
        return;
      }
      const disabledActionTitle = disabledActionText?.({ state, ...actionProps, rowData });

      if (disabledActionTitle) {
        return (
          <Tooltip key={label} title={disabledActionTitle} placement="bottom" >
            <div>
              <MenuItem disabled>
                <Icon />
                {label}
              </MenuItem>
            </div>
          </Tooltip>
        );
      }

      return (
        <MenuItem key={label} onClick={handleActionClick}>
          <Icon />
          {label}
        </MenuItem>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectAction]
  );

  const actions = useMemo(() => {
    // rowActions may or may not be a fn. Sometimes
    // the actions are static, other times they are
    // determinant on the resource they apply to.
    // Check on this later for the scope of refactor
    const meta = typeof rowActions === 'function'
      ? rowActions(rowData, actionProps)
      : rowActions;

    return meta.map(({ icon, label, disabledActionText, hasAccess, component: Action }) => ({
      Icon: icon,
      disabledActionText,
      hasAccess,
      rowData,
      actionProps,
      label:
      typeof label === 'function'
        ? label(rowData, actionProps)
        : label,
      component: <Action {...actionProps} rowData={rowData} />,
    }));
  }, [actionProps, rowActions, rowData]);

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
