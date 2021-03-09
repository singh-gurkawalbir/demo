import React, { useState, useCallback, useMemo } from 'react';
import { IconButton, MenuItem, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';
import ArrowPopper from '../../ArrowPopper';

const useStyles = makeStyles(theme => ({
  actionsMenuPopper: {
    maxWidth: 250,
    top: `${theme.spacing(1)}px !important`,
  },
}));

const Action = ({ isSingleAction, label, Icon, disabledActionText, useHasAccess, actionProps, rowData, component, selectAction, handleMenuClose}) => {
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

  if (isSingleAction) {
    return (
      <Tooltip data-public title={disabledActionTitle || label} placement="bottom" >
        {/* The <div> below seems to be redundant as it does not provide any presentation benefit.
            However, without this wrapper div, if the action is disabled, the <Tooltip> wrapper
            doesn't recognize the hover state and thus doesn't show the tooltip message.
        */}
        <div>
          <IconButton size="small" disabled={!!disabledActionTitle} onClick={handleActionClick}>
            {actionIcon}
          </IconButton>
        </div>
      </Tooltip>
    );
  }

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

export default function ActionMenu({ variant, rowActions, rowData, actionProps, selectAction }) {
  const classes = useStyles();
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

  if (actions.length === 1 && variant === 'slim') {
    // lets keep the isSingleAction mechanism so 'slim' variants of CeligoTable
    // will still intelligently render single actions, or multiple under an ellipsis.
    // "Slim" variants currently have only  action, but possibly future use cases
    // want a slim treatment but preserve ellipsis for multi-action rows.
    return (<Action isSingleAction {...actions[0]} />);
  }

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

      <ArrowPopper
        placement="bottom-end"
        restrictToParent={false}
        classes={{ popper: classes.actionsMenuPopper }}
        open={open}
        anchorEl={anchorEl}
        id={actionsPopoverId}
        onClose={handleMenuClose}>
        {actions.map(a => <Action key={a.label} {...a} />)}
      </ArrowPopper>
    </>
  );
}
