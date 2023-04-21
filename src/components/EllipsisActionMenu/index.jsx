import React, { useCallback, useState} from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import EllipsisIconHorizontal from '../icons/EllipsisHorizontalIcon';
import EllipsisIconVertical from '../icons/EllipsisVerticalIcon';
import {TextButton} from '../Buttons';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& > .MuiMenu-paper': {
      marginLeft: theme.spacing(-2),
    },
  },
  deleteWrapper: {
    color: theme.palette.error.dark,
  },
}));

const ActionLabel = (({ label, Icon }) => {
  if (Icon) {
    return (<><Icon /> {label}</>);
  }

  return label;
});

export default function EllipsisActionMenu({ actionsMenu, label, onAction, alignment }) {
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

  const isDeleteOption = label => (/^Delete/.test(label) || /^Uninstall/.test(label) || /^Purge/.test(label));

  return (
    <>
      {label ? (
        <TextButton
          data-test="openActionsMenu"
          aria-label="more"
          aria-controls={actionsPopoverId}
          aria-haspopup="true"
          onClick={handleMenuClick}
          startIcon={alignment === 'vertical' ? <EllipsisIconVertical /> : <EllipsisIconHorizontal />} >
          {label}
        </TextButton>
      )
        : (
          <IconButton
            data-test="openActionsMenu"
            aria-label="more"
            aria-controls={actionsPopoverId}
            aria-haspopup="true"
            size="small"
            onClick={handleMenuClick}>
            {alignment === 'vertical' ? <EllipsisIconVertical /> : <EllipsisIconHorizontal />}
          </IconButton>
        )}
      <Menu
        elevation={2}
        variant="menu"
        id={actionsPopoverId}
        anchorEl={anchorEl}
        className={classes.wrapper}
        open={open}
        onClose={handleMenuClose}>
        {actionsMenu?.map(({ action, label, Icon, disabled }) => (
          <MenuItem
            key={label}
            data-test={`${action}`}
            disabled={disabled}
            className={clsx({[classes.deleteWrapper]: isDeleteOption(label)})}
            onClick={handleAction(action)}>
            <ActionLabel classes={classes} label={label} Icon={Icon} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
