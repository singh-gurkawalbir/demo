import React, { Fragment } from 'react';
import {Snackbar, Typography} from '@material-ui/core';
import { PING_STATES } from '../../reducers/comms/ping';
import ClosableSnackbarContent from './ClosableSnackbarContent';
import TestConnectionSnackbar from './TestConnectionSnackbar';
import RawHtml from '../RawHtml';

const commStateToVariantType = {
  success: 'success',
  loading: 'info',
  error: 'error',
  aborted: 'success',
};

const ErroredMessageList = ({ messages }) =>
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
