import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ErroredMessageList } from '../NetworkSnackbar';
import { PING_STATES } from '../../reducers/comms/ping';
import ClosableSnackbarContent from './ClosableSnackbarContent';

const commStateToVariantType = {
  success: 'success',
  loading: 'info',
  error: 'error',
  aborted: 'success',
};
const CancellableSpinner = props => (
  <div>
    <div>
      <Button
        data-test="cancelTestCall"
        size="small"
        variant="contained"
        color="secondary"
        onClick={props.onCancel}>
        Click here to cancel this Test call
      </Button>
    </div>
    <div>
      <p />
    </div>
    <LinearProgress />
  </div>
);
const generateMessageBasedOnState = (commState, messages, onCancelTask) => {
  if (commState === PING_STATES.LOADING)
    return <CancellableSpinner onCancel={onCancelTask} />;
  else if (commState === PING_STATES.ERROR && messages) {
    return <ErroredMessageList messages={messages} />;
  }
};

export default function PingMessageSnackbar(props) {
  const { commStatus, onClose, onCancelTask } = props;
  const { commState, message } = commStatus;
  const variant = commStateToVariantType[commState];
  const msg = generateMessageBasedOnState(commState, message, onCancelTask);

  if (!msg) return null;

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open
        autoHideDuration={6000}>
        <ClosableSnackbarContent
          onClose={onClose}
          variant={variant || 'info'}
          message={msg}
        />
      </Snackbar>
    </div>
  );
}
