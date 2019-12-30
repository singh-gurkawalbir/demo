import { useState, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
// TODO: Azhar, can you update these to Celigo icons? (if needed)
import AcceptIcon from '@material-ui/icons/Check';
import DismissIcon from '@material-ui/icons/Clear';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(() => ({
  itemContainer: {
    '& button': { display: 'none' },
    '&:hover button': {
      display: 'inline',
    },
  },
  itemRoot: {
    paddingRight: 90,
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
  const notifications = useSelector(
    state => selectors.userNotifications(state),
    // if the following expression is 'true', no re-render is performed
    (left, right) => left.length === right.length
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
  const handleAction = useCallback(
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

  return (
    <Fragment>
      <IconButton size="small" color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="primary">
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
        <List dense>
          {notifications.map(a => (
            <ListItem
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              key={`${a.id}`}>
              <ListItemText
                primary={
                  <Typography component="span">{a.primaryMessage}</Typography>
                }
                secondary={<Typography>{a.secondaryMessage}</Typography>}
              />
              <ListItemSecondaryAction>
                <IconButton
                  className={classes.button}
                  data-test={`accept ${a.type} share`}
                  aria-label="Accept"
                  onClick={handleAction(a.type, 'accept', a.id)}>
                  <AcceptIcon />
                </IconButton>
                <IconButton
                  className={classes.button}
                  data-test={`dismiss ${a.type} share`}
                  aria-label="Dismiss"
                  onClick={handleAction(a.type, 'reject', a.id)}>
                  <DismissIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ArrowPopper>
    </Fragment>
  );
}
