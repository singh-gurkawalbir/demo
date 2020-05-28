import { Button, Snackbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import RawHtml from '../RawHtml';
import SystemStatus from '../SystemStatus';

const useStyles = makeStyles({
  snackbarWrapper: {
    background: 'transparent',
  },
});
const Dismiss = props =>
  props.show && (
    <Button
      data-test="dismissNetworkSnackbar"
      variant="contained"
      color="primary"
      onClick={props.onClick}>
      Dismiss
    </Button>
  );

export const ErroredMessageList = ({ messages }) =>
  messages && messages.length > 0
    ? messages.map((msg, index) => (
        <Fragment key={msg}>
          {
            // Check if the message contains html elements, render it as html
          }
          {/<\/?[a-z][\s\S]*>/i.test(msg) ? (
            <RawHtml html={msg} />
          ) : (
            <Typography color="error">{msg}</Typography>
          )}
          {index > 0 && <br />}
        </Fragment>
      ))
    : null;
const LOADING_MSG = 'Loading...';
const RETRY_MSG = 'Retrying… please hold.';
const Notifications = ({ allLoadingOrErrored }) => {
  if (!allLoadingOrErrored || !allLoadingOrErrored.length) return null;
  const loadingMessage = allLoadingOrErrored.some(
    r => r.status === COMM_STATES.LOADING && !r.retryCount
  ) && (
    <li key={LOADING_MSG}>
      <Typography>{LOADING_MSG}</Typography>
    </li>
  );
  const retryMessage = allLoadingOrErrored.some(
    r => r.status === COMM_STATES.LOADING && r.retryCount
  ) && (
    <li key={RETRY_MSG}>
      <Typography>{RETRY_MSG}</Typography>
    </li>
  );
  const errored = allLoadingOrErrored
    .filter(r => r.status === COMM_STATES.ERROR)
    .map(r => (
      <li key={r.name}>
        {r.message && <ErroredMessageList messages={r.message} />}
      </li>
    ));

  return [loadingMessage, retryMessage, ...errored].filter(r => r);
};

export default function NetworkSnackbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAllLoadingCommsAboveThreshold = useSelector(state =>
    selectors.isAllLoadingCommsAboveThreshold(state)
  );
  const allLoadingOrErrored = useSelector(state =>
    selectors.allLoadingOrErroredWithCorrectlyInferredErroredMessage(state)
  );
  const isLoadingAnyResource = useSelector(state =>
    selectors.isLoadingAnyResource(state)
  );
  const handleClearComms = useCallback(() => {
    dispatch(actions.clearComms());
  }, [dispatch]);

  if (!isAllLoadingCommsAboveThreshold || !allLoadingOrErrored) {
    return null;
  }

  // const msg = (
  //   <SystemStatus isLoading={isLoadingAnyResource}>
  //     <ul>{allLoadingOrErrored.map(r => notification(r))}</ul>
  //     <Dismiss show={!isLoadingAnyResource} onClick={handleClearComms} />
  //   </SystemStatus>
  // );
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open
      // autoHideDuration={6000}
      // onClose={this.handleClose}
      // message={msg}
      className={classes.snackbarWrapper}>
      <SystemStatus isLoading={isLoadingAnyResource}>
        <ul>
          <Notifications allLoadingOrErrored={allLoadingOrErrored} />
        </ul>

        <Dismiss show={!isLoadingAnyResource} onClick={handleClearComms} />
      </SystemStatus>
    </Snackbar>
  );
}
