import React from 'react';
import IconButton from '@mui/material/IconButton';
import { ArrowPopper } from '@celigo/fuse-ui';
import MenuItem from '@mui/material/MenuItem';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import EllipsisIconVertical from '../../../icons/EllipsisVerticalIcon';
import NotificationsIcon from '../../../icons/NotificationsIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuitem: {
    minWidth: 145,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    fontSize: 15,
    transition: 'all .4s ease',
    padding: '8px 10px',
    fontFamily: 'source sans pro',
    minHeight: 'unset',
    lineHeight: '19px',
  },

  item: {
    background: theme.palette.background.default,
  },
  action: {
    '&:hover': {
      background: theme.palette.background.paper2,
    },
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationIcon: {
    position: 'absolute',
    top: '0px',
    right: '3px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
  },
}));

export default function HeaderAction(props) {
  const { variants } = props;
  const classes = useStyles();
  const options = variants;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.notificationWrapper}>
        <span className={classes.notificationIcon} />
        <NotificationsIcon />
      </div>
      <IconButton
        data-test="openHeaderActionMenu"
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.action}
        size="large">
        <EllipsisIconVertical />
      </IconButton>
      <ArrowPopper
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {options.map(option => (
          <MenuItem
            key={option}
            className={classes.menuitem}
            selected={option === 'settings'}
            onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </ArrowPopper>
    </div>
  );
}
