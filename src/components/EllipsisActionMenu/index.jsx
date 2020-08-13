import React, { useCallback, useState} from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EllipsisIcon from '../icons/EllipsisHorizontalIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& > .MuiMenu-paper': {
      marginLeft: theme.spacing(-2),
    },
  },
}));

const ActionLabel = (({ label, Icon }) => {
  if (Icon) {
    return (<><Icon /> {label}</>);
  }

  return label;
});

export default function EllipsisActionMenu({ actionsMenu, onAction }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'more-row-actions' : undefined;

  const handleAction = useCallback(action => () => {
    handleMenuClose();
    onAction(action);
  }, [onAction, handleMenuClose]);

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
        className={classes.wrapper}
        open={open}
        onClose={handleMenuClose}>
        {actionsMenu.map(({ action, label, Icon, disabled }) => (
          <MenuItem
            key={label}
            data-test={`${action}`}
            disabled={disabled}
            onClick={handleAction(action)}>
            <ActionLabel label={label} Icon={Icon} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
