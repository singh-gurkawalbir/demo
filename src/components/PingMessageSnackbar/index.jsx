import React from 'react';
import { Box, Snackbar } from '@mui/material';
import { PING_STATES } from '../../reducers/comms/ping';
import NotificationToaster from '../NotificationToaster';
import TestConnectionSnackbar from './TestConnectionSnackbar';
import ErrorContent from '../ErrorContent';

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

  if (commState !== PING_STATES.ERROR || !message?.[0]) {
    return null;
  }

  return (
    <Snackbar
      open
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Box>
        <NotificationToaster
          variant={variant || 'info'}
          size="medium"
          fullWidth
          onClose={onClose}>
          <ErrorContent error={message[0]} />
        </NotificationToaster>
      </Box>
    </Snackbar>
  );
}
