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

  const errorNotifications = allLoadingOrErrored
    .filter(r => r.status === COMM_STATES.ERROR);

  if (errorNotifications?.length === 0) return null;

  if (errorNotifications.length === 1) {
    return <ErroredMessageList messages={errorNotifications[0]} />;
  }

  const notificationMsgs = errorNotifications.map(({name, status, message}) => (
    <li key={name}>
      <ErroredMessageList status={status} message={message} />
    </li>));

  return <ul>{notificationMsgs}</ul>;
};

export default function NetworkSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loadingAndErroredMessages = useSelector(state =>
    selectors.allLoadingOrErroredWithCorrectlyInferredErroredMessage(state)
  );
  const handleClearComms = useCallback(() => {
    dispatch(actions.clearComms());
  }, [dispatch]);

  if (!loadingAndErroredMessages) {
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
      <SystemStatus>
        <Notifications allLoadingOrErrored={loadingAndErroredMessages} />
        <Button
          data-test="dismissNetworkSnackbar"
          variant="contained"
          color="primary"
          onClick={handleClearComms}>
          Dismiss
        </Button>
      </SystemStatus>
    </Snackbar>
  );
}
