import React, { useState, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, Badge, Divider } from '@material-ui/core';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import InvitationItem from './InvitationItem';

const useStyles = makeStyles(theme => ({
  notificationContainer: {
    padding: theme.spacing(3),
  },
  badgeText: {
    '& > span': {
      height: 15,
      minWidth: 15,
      transform: 'scale(1) translate(33%, -20%)',
      color: theme.palette.background.paper,
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

export default function Notifications() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  // note the use of custom comparator. This checks the content of notifications,
  // not the reference. This prevents re-renders when the notifications
  // lengths match. It is hard to imagine a situation were the number of notifications
  // remains the same and the notifications themselves change. usually new ones get
  // added or removed (if rejected/accepted).
  const notifications = useSelector(state =>
    selectors.userNotifications(state)
  );
  const handleClick = useCallback(
    event => {
      setAnchorEl(!anchorEl ? event.currentTarget : null);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleActionClick = useCallback(
    (resourceType, action, id) => () => {
      switch (action) {
        case 'accept':
          return dispatch(
            actions.user.sharedNotifications.acceptInvite(resourceType, id)
          );
        case 'reject':
          return dispatch(
            actions.user.sharedNotifications.rejectInvite(resourceType, id)
          );
        default:
          return null;
      }
    },
    [dispatch]
  );
  const open = !!anchorEl;

  if (!notifications || notifications.length === 0) {
    return (
      <Tooltip title="No notifications" placement="bottom">
        <IconButton size="small" color="inherit">
          <NotificationsIcon />
        </IconButton>
      </Tooltip>
    );
  }
  // Here also i need to do change

  return (
    <>
      <IconButton size="small" color="inherit" onClick={handleClick}>
        <Badge
          badgeContent={notifications.length}
          color="primary"
          className={classes.badgeText}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <ArrowPopper
        id="notifications"
        className={classes.popper}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>
        <div className={classes.notificationContainer}>
          {notifications.map((n, i) => (
            <Fragment key={n.id}>
              <InvitationItem
                id={n.id}
                type={n.type}
                onActionClick={handleActionClick}
                name={n.nameOrCompany}
                email={n.email}
                stackName={n.stackName}
                integrationsToTransfer={n.integrationsToTransfer}
              />
              {i < notifications.length - 1 && (
                <Divider className={classes.divider} />
              )}
            </Fragment>
          ))}
        </div>
      </ArrowPopper>
    </>
  );
}
