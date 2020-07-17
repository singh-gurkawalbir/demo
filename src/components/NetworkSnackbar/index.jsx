import { Button, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import RawHtml from '../RawHtml';
import SystemStatus from './SystemStatus';

const useStyles = makeStyles({
  snackbarWrapper: {
    background: 'transparent',
  },
});

export const ErroredMessageList = ({ messages }) =>
  messages?.length
    ? messages.filter(msg => !!msg).map((msg, index) => (
      <Fragment key={msg}>
        { /* If the message contains html elements, render it as html */ }
        {/<\/?[a-z][\s\S]*>/i.test(msg) ? (
          <RawHtml html={msg} />
        ) : (
          <Typography color="error">{msg}</Typography>
        )}
        {index > 0 && <br />}
      </Fragment>
    ))
    : null;

const Notifications = ({ allLoadingOrErrored }) => {
  if (!allLoadingOrErrored || !allLoadingOrErrored.length) {
    return null;
  }

  const loadingMessage = allLoadingOrErrored.some(
    r => r.status === COMM_STATES.LOADING && !r.retryCount
  ) && ({name: 'loading', message: 'Loading'});

  const retryMessage = allLoadingOrErrored.some(
    r => r.status === COMM_STATES.LOADING && r.retryCount
  ) && ({name: 'retry', message: 'Retrying… Hold your breath…'});

  const errored = allLoadingOrErrored
    .filter(r => r.status === COMM_STATES.ERROR);

  const consolidatedNotificationMsgs = [loadingMessage, retryMessage, ...errored].filter(r => r);

  const NotificationMsg = ({status, message}) => status === COMM_STATES.ERROR
    ? (<ErroredMessageList messages={message} />)
    : <Typography>{message}</Typography>;

  if (consolidatedNotificationMsgs.length === 1) {
    return <NotificationMsg {...consolidatedNotificationMsgs[0]} />;
  }

  const notificationMsgs = consolidatedNotificationMsgs.map(({name, status, message}) => (
    <li key={name}>
      <NotificationMsg status={status} message={message} />
    </li>));

  return <ul>{notificationMsgs}</ul>;
};

export default function NetworkSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAllLoadingCommsAboveThreshold = useSelector(state =>
    selectors.isAllLoadingCommsAboveThreshold(state)
  );
  const loadingAndErroredMessages = useSelector(state =>
    selectors.allLoadingOrErroredWithCorrectlyInferredErroredMessage(state)
  );
  const isLoadingAnyResource = useSelector(state =>
    selectors.isLoadingAnyResource(state)
  );
  const handleClearComms = useCallback(() => {
    dispatch(actions.clearComms());
  }, [dispatch]);

  if (!isAllLoadingCommsAboveThreshold || !loadingAndErroredMessages) {
    return null;
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open
      className={classes.snackbarWrapper}>
      <SystemStatus isLoading={isLoadingAnyResource}>
        <Notifications allLoadingOrErrored={loadingAndErroredMessages} />
        {!isLoadingAnyResource && (
        <Button
          data-test="dismissNetworkSnackbar"
          variant="contained"
          color="primary"
          onClick={handleClearComms}>
          Dismiss
        </Button>
        )}
      </SystemStatus>
    </Snackbar>
  );
}
