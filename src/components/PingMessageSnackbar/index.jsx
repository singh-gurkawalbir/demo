import React from 'react';
import { makeStyles, Snackbar } from '@material-ui/core';
import { PING_STATES } from '../../reducers/comms/ping';
import RawHtml from '../RawHtml';
import NotificationToaster from '../NotificationToaster';
import TestConnectionSnackbar from './TestConnectionSnackbar';

const useStyles = makeStyles(() => ({
  errorText: {
    maxHeight: 400,
    overflowY: 'auto',
  },
}));

const commStateToVariantType = {
  success: 'success',
  loading: 'info',
  error: 'error',
  aborted: 'success',
};
const isHTML = s => /<\/?[a-z][\s\S]*>/i.test(s);

export default function PingMessageSnackbar({ commStatus, onClose, onCancelTask }) {
  const { commState, message } = commStatus;
  const variant = commStateToVariantType[commState];
  const classes = useStyles();

  if (commState === PING_STATES.LOADING) {
    return <TestConnectionSnackbar onCancel={onCancelTask} />;
  }

  if (commState !== PING_STATES.ERROR || !message || !message.length) {
    return null;
  }

  const msg = message[0];
  return (
    <Snackbar
      open
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}>
      <NotificationToaster
        variant={variant || 'info'}
        size="medium"
        fullWidth
        onClose={onClose}>
        <div className={classes.errorText}>
          {isHTML(msg) ? <RawHtml html={msg} /> : msg}
        </div>
      </NotificationToaster>
    </Snackbar>);
}
