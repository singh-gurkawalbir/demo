import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import ArrowPopper from '../../ArrowPopper';
import EllipsisIcon from '../../icons/EllipsisHorizontalIcon';
import MultipleAction from './MultipleAction';
import SingleAction from './SingleAction';

const useStyles = makeStyles(theme => ({
  actionsMenuPopper: {
    maxWidth: 250,
    top: `${theme.spacing(1)}px !important`,
  },
}));

export default function ActionMenu({ useRowActions, variant, rowData }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  // We are passing state to action items where each Action item would check if it has got permission.
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(
    event => {
      setAnchorEl(event.currentTarget);
    },
    []
  );
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const actions = useRowActions(rowData);

  if (!actions || !actions.length) return null;

  if (actions.length === 1 && variant === 'slim') {
    // lets keep the isSingleAction mechanism so 'slim' variants of CeligoTable
    // will still intelligently render single action when possible, or group
    // multiple under an ellipsis.
    // "Slim" variants currently have at most 1 action, but possibly future tables
    // want a slim treatment but preserve ellipsis for multi-action rows.
    // The table will still be slim by eliminating the action column heading.
    // Possibly other slim CSS will get applied for row hover and reduced padding, etc.
    return (<SingleAction rowData={rowData} handleMenuClose={handleMenuClose} meta={actions[0]} />);
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
        {actions.map(meta => (
          <MultipleAction
            key={meta.key}
            handleMenuClose={handleMenuClose}
            meta={meta}
            rowData={rowData} />
        ))}
      </ArrowPopper>
    </>
  );
}
