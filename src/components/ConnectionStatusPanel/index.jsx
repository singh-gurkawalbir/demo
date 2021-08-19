import React, { useEffect, useCallback, useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import NotificationToaster from '../NotificationToaster';
import { PING_STATES } from '../../reducers/comms/ping';
import { isNewId } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../utils/constants';
import { TextButton } from '../Buttons';

const useStyles = makeStyles(theme => ({
  fixConnectionBtn: {
    fontSize: 15,
    lineHeight: '17px',
    padding: 6,
  },
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
  },
}));
const getStatusVariantAndMessage = ({
  resourceType,
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
  } if (testStatus === PING_STATES.SUCCESS) {
    return {
      variant: 'success',
      message: 'Your connection is working great! Nice Job!',
    };
  } if (!testStatus && showOfflineMsg) {
    return {
      variant: 'error',
      message: 'This connection is currently offline. Re-enter your credentials to bring it back online.',
    };
  }

  return {};
};

export default function ConnectionStatusPanel({ className, resourceId, resourceType, isFlowBuilderView }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const connectionId =
    resourceType === 'connections' ? resourceId : resource._connectionId;
  const testStatus = useSelector(
    state => {
      const commStatus = selectors.testConnectionCommState(state, connectionId)?.commState;

      if (resource.type === 'netsuite' && !commStatus) {
        const {status, hideNotificationMessage} = selectors.netsuiteUserRoles(state, connectionId);

        if (!hideNotificationMessage) {
          return status;
        }
      }

      return commStatus;
    }
  );
  const isIAIntegration = useSelector(state => {
    const connection =
      selectors.resource(state, 'connections', connectionId) || {};

    return !!(connection && connection._connectorId);
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
    if (!isFlowBuilderView && connectionId && !isNewId(connectionId)) {
      dispatch(actions.resource.connections.pingAndUpdate(connectionId));
    }

    dispatch(actions.resource.connections.testClear(connectionId));

    return () => {
      dispatch(actions.resource.connections.testClear(connectionId));
    };
  }, [connectionId, dispatch, isFlowBuilderView]);

  if (
    (resourceType !== 'connections' && !isOffline) ||
    (resourceType === 'connections' && !message)
  ) {
    return null;
  }

  return (
    <div className={className}>
      <NotificationToaster variant={variant} size="large">
        {resourceType === 'connections' ? (
          <Typography variant="h6" className={classes.titleStatusPanel}>{message}</Typography>
        ) : (
          <Typography component="div" variant="h6" className={classes.titleStatusPanel}>
            The connection associated with this resource is currently offline
            and configuration is limited.
            <TextButton
              data-test="fixConnection"
              color="primary"
              className={classes.fixConnectionBtn}
              onClick={handleConnectionFixClick}>
              Fix your connection
            </TextButton>
            to bring it back online.
          </Typography>
        )}
      </NotificationToaster>
    </div>
  );
}
