import React from 'react';
import {Snackbar} from '@material-ui/core';
import { ErroredMessageList } from '../NetworkSnackbar';
import { PING_STATES } from '../../reducers/comms/ping';
import ClosableSnackbarContent from './ClosableSnackbarContent';
import TestConnectionSnackbar from './TestConnectionSnackbar';

const commStateToVariantType = {
  success: 'success',
  loading: 'info',
  error: 'error',
  aborted: 'success',
};

export default function PingMessageSnackbar({ commStatus, onClose, onCancelTask }) {
  const { commState, message } = commStatus;
  const variant = commStateToVariantType[commState];

  if (commState === PING_STATES.LOADING) {
    return <TestConnectionSnackbar onCancel={onCancelTask} />;
  }

  if (commState !== PING_STATES.ERROR || !message) {
    return null;
  }

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
          message={<ErroredMessageList messages={message} />}
        />
      </Snackbar>
    </div>
  );
}
