import React, { useState, useCallback, Fragment, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Tooltip, IconButton, Badge, Divider } from '@mui/material';
import { ArrowPopper } from '@celigo/fuse-ui';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import InvitationItem from './InvitationItem';
import LoadResources from '../../../components/LoadResources';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';

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
  btnNotification: {
    padding: 0,
    color: 'inherit',
  },
}));

function Notifications() {
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
  const isAccountOwner = useSelector(state =>
    selectors.isAccountOwner(state)
  );
  const mfaSessionInfoStatus = useSelector(selectors.mfaSessionInfoStatus);
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);

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
    (resourceType, action, id, isAccountTransfer) => () => {
      setAnchorEl(null);
      switch (action) {
        case 'accept':
          return dispatch(
            actions.user.sharedNotifications.acceptInvite(resourceType, id, isAccountTransfer)
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

  // we proceed further only when mfa sessionInfo is received
  if (!mfaSessionInfoStatus || mfaSessionInfoStatus === 'requested') return null;

  if (isMFASetupIncomplete) {
    return null;
  }
  if (!notifications || notifications.length === 0) {
    return (
      <>
        <LoadResources resources={isAccountOwner ? 'transfers' : 'transfers/invited'} />
        <Tooltip title="No notifications" placement="bottom" aria-label="no notifications">
          <IconButton aria-label="notifications" size="small" color="inherit" className={classes.btnNotification}>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <LoadResources resources={isAccountOwner ? 'transfers' : 'transfers/invited'} />
      <IconButtonWithTooltip
        tooltipProps={{title: 'Notifications'}}
        aria-label="notifications"
        size="small"
        color="inherit"
        noPadding
        onClick={handleClick}>
        <Badge
          badgeContent={notifications.length}
          color="primary"
          className={classes.badgeText}>
          <NotificationsIcon />
        </Badge>
      </IconButtonWithTooltip>

      <ArrowPopper
        id="notifications"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>
        {/* a user's email can be shown */}
        <div className={classes.notificationContainer} data-private>
          {notifications.map((n, i) => (
            <Fragment key={n.id}>
              <InvitationItem
                id={n.id}
                type={n.type}
                isAccountTransfer={n.type === 'transfer' && n.account === true}
                onActionClick={handleActionClick}
                name={n.nameOrCompany}
                email={n.email}
                message={n.message}
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

export default function NotificationsMemo() {
  return useMemo(() => <Notifications />, []);
}
