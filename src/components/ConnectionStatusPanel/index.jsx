import { useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import NotificationToaster from '../NotificationToaster';
import { PING_STATES } from '../../reducers/comms/ping';
import { isNewId } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1, 0),
  },
  fixConnectionBtn: {
    color: theme.palette.primary.main,
    fontSize: 15,
    lineHeight: '17px',
    padding: 6,
  },
}));
const getStatusVariantAndMessage = ({
  resourceType,
  isConnectionFix,
  showOfflineMsg,
  testStatus,
}) => {
  if (resourceType !== 'connections') {
    return { variant: 'warning' };
  }

  if (testStatus === PING_STATES.ERROR) {
    return {
      variant: 'error',
      message:
        'Your test was not successful. Check your information and try again',
    };
  } else if (testStatus === PING_STATES.SUCCESS) {
    return {
      variant: 'success',
      message: 'Your connection is working great! Nice Job!',
    };
  } else if (!testStatus && showOfflineMsg) {
    return {
      variant: 'error',
      message: isConnectionFix
        ? ' Review and test this form to bring your connections back online.'
        : 'The connection is currently offline. Review and test this form to bring your connection back online.',
    };
  }

  return {};
};

export default function ConnectionStatusPanel(props) {
  const { resourceId, resourceType } = props;
  const classes = useStyles();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { merged: resource } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const connectionId =
    resourceType === 'connections' ? resourceId : resource._connectionId;
  const testStatus = useSelector(
    state => selectors.testConnectionCommState(state, connectionId).commState
  );
  const isIAIntegration = useSelector(state => {
    const connection =
      selectors.resource(state, 'connections', connectionId) || {};

    return !!connection._connectorId;
  });
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
  );
  const isIAConnectionSetupPending = useSelector(state =>
    selectors.isIAConnectionSetupPending(state, connectionId)
  );
  const handleConnectionFixClick = useCallback(() => {
    history.push(
      `${
        match.path.split(':')[0]
      }edit/connections/${connectionId}?fixConnnection=true`
    );
  }, [connectionId, history, match.path]);
  const { variant, message } = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const isConnectionFix = queryParams.get('fixConnnection') === 'true';
    const showOfflineMsg = isIAIntegration
      ? !isIAConnectionSetupPending && isOffline
      : isOffline;

    return getStatusVariantAndMessage({
      isConnectionFix,
      showOfflineMsg,
      testStatus,
      resourceType,
    });
  }, [
    isIAConnectionSetupPending,
    isIAIntegration,
    isOffline,
    location.search,
    resourceType,
    testStatus,
  ]);

  useEffect(() => {
    // if i can't find a connection Id it could be a new resource without any connection Id assigned to it
    // and if it is a new connection resource you are creating then there is no point in making ping calls
    if (connectionId && !isNewId(connectionId)) {
      dispatch(actions.resource.connections.pingAndUpdate(connectionId));
    }

    dispatch(actions.resource.connections.testClear(connectionId));

    return () => {
      dispatch(actions.resource.connections.testClear(connectionId));
    };
  }, [connectionId, dispatch]);

  if (
    (resourceType !== 'connections' && !isOffline) ||
    (resourceType === 'connections' && !message)
  ) {
    return null;
  }

  return (
    <div className={classes.root}>
      <NotificationToaster variant={variant} size="large">
        {resourceType === 'connections' ? (
          <Typography variant="h6">{message}</Typography>
        ) : (
          <Typography component="div" variant="h6">
            The connection associated with this export is currently offline and
            configuration is limited.
            <Button
              data-test="fixConnection"
              className={classes.fixConnectionBtn}
              onClick={handleConnectionFixClick}>
              Fix your connection
            </Button>
            to bring it back online.
          </Typography>
        )}
      </NotificationToaster>
    </div>
  );
}
