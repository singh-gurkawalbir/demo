import React, { useEffect, useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import NotificationToaster from '../../NotificationToaster';
import { PING_STATES } from '../../../reducers/comms/ping';
import { TextButton } from '../../Buttons';
import { message } from '../../../utils/messageStore';
// import { isNewId } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1, 0),
  },
  fixConnectionBtn: {
    color: theme.palette.primary.main,
  },
}));
const getStatusVariantAndMessage = ({
  resourceType,
  isConnectionFix,
  isOffline,
  testStatus,
}) => {
  if (resourceType !== 'connections') {
    return { variant: 'warning' };
  }

  if (testStatus === PING_STATES.ERROR) {
    return {
      variant: 'error',
      message: message.CONNECTION.PING_STATES_ERROR,
    };
  }
  if (testStatus === PING_STATES.SUCCESS) {
    return {
      variant: 'success',
      message: 'Your connection is working great! Nice Job!',
    };
  }
  if (!testStatus && isOffline) {
    return {
      variant: 'error',
      message: isConnectionFix
        ? message.CONNECTION.FIX
        : message.CONNECTION.NOT_FIXED,
    };
  }

  return {};
};

export default function ConnectionStatusPanel(props) {
  const { resourceId, resourceType, ssLinkedConnectionId } = props;
  const classes = useStyles();
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const connectionId = useSelector(state => {
    if (resourceType === 'connections') return resourceId;
    const { merged: resource } = selectors.suiteScriptResourceData(state, {
      resourceType,
      id: resourceId,
      ssLinkedConnectionId,
    });

    return resource._connectionId;
  });
  const testStatus = useSelector(
    state =>
      selectors.suiteScriptTestConnectionCommState(
        state,
        connectionId,
        ssLinkedConnectionId
      ).commState
  );
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, connectionId)
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

    return getStatusVariantAndMessage({
      isConnectionFix,
      isOffline,
      testStatus,
      resourceType,
    });
  }, [isOffline, location.search, resourceType, testStatus]);

  useEffect(() => {
    dispatch(
      actions.suiteScript.resource.connections.testClear(
        connectionId,
        false,
        ssLinkedConnectionId
      )
    );

    return () => {
      dispatch(
        actions.suiteScript.resource.connections.testClear(
          connectionId,
          false,
          ssLinkedConnectionId
        )
      );
    };
  }, [connectionId, dispatch, ssLinkedConnectionId]);

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
            {message.CONNECTION.OFFLINE_LIMITED}
            <TextButton
              data-test="fixConnection"
              size="small"
              color="primary"
              onClick={handleConnectionFixClick}>
              Fix your connection
            </TextButton>
            to bring it back online
          </Typography>
        )}
      </NotificationToaster>
    </div>
  );
}
