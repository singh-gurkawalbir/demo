import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import { PING_STATES } from '../../reducers/comms/ping';
import ShowStatus from '../ShowStatus';

const useStyles = makeStyles(() => ({
  snackbarContent: {
    '& > div:first-child': {
      width: '100%',
      minWidth: '100%',
      '& > div:first-child': {
        width: '100%',
        minWidth: '100%',
      },
    },
  },
}));
const getStatusVariantAndMessage = ({
  connectionRequestStatus,
  isConnectionFixFromImpExp,
  isConnectionOffline,
  pingStatus,
}) => {
  if (pingStatus === PING_STATES.ERROR) {
    return {
      variant: 'error',
      statusMsg:
        'Your test was not successful. Check your information and try again',
    };
  } else if (pingStatus === PING_STATES.SUCCESS) {
    return {
      variant: 'success',
      statusMsg: 'Your connection is working great! Nice Job!',
    };
  } else if (connectionRequestStatus !== 'requested' && isConnectionOffline) {
    return {
      variant: 'error',
      statusMsg: isConnectionFixFromImpExp
        ? ' Review and test this form to bring your connections back online.'
        : 'The connection is currently offline. Review and test this form to bring your connection back online.',
    };
  }

  return {};
};

export default function ConnectionNotification(props) {
  const { connectionId } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const queryParams = new URLSearchParams(useLocation().search);
  const isConnectionFixFromImpExp =
    queryParams.get('fixConnnection') === 'true';
  const [pingStatus, setPingStatus] = useState();

  useEffect(() => {
    // ping to get connection status
    dispatch(actions.resource.connections.pingAndUpdate(connectionId));

    return () => {
      dispatch(actions.resource.connections.testClear(connectionId));
    };
  }, [connectionId, dispatch]);
  const isConnectionOffline = useSelector(
    state => selectors.connectionStatus(state, connectionId).offline
  );
  const connectionRequestStatus = useSelector(
    state => selectors.connectionStatus(state, connectionId).requestStatus
  );
  const testConnectionStatus = useSelector(
    state => selectors.testConnectionCommState(state, connectionId).commState
  );

  useEffect(() => {
    if ([PING_STATES.ERROR, PING_STATES.SUCCESS].includes(testConnectionStatus))
      setPingStatus(testConnectionStatus);
  }, [testConnectionStatus]);

  const { variant, statusMsg } = getStatusVariantAndMessage({
    connectionRequestStatus,
    isConnectionFixFromImpExp,
    isConnectionOffline,
    pingStatus,
  });

  if (!statusMsg) {
    return null;
  }

  return (
    <div className={classes.contentWrapper}>
      <ShowStatus variant={variant} className={classes.snackbarContent}>
        <Typography variant="h6">{statusMsg}</Typography>
      </ShowStatus>
    </div>
  );
}
