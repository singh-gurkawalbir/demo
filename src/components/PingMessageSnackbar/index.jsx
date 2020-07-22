import React from 'react';
import { makeStyles, Snackbar } from '@material-ui/core';
import { PING_STATES } from '../../reducers/comms/ping';
import RawHtml from '../RawHtml';
import CodeEditor from '../CodeEditor';
import NotificationToaster from '../NotificationToaster';
import TestConnectionSnackbar from './TestConnectionSnackbar';
import { isJsonString } from '../../utils/string';

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
const isHTML = text => /<\/?[a-z][\s\S]*>/i.test(text);
const formatError = error => {
  if (isJsonString(error)) {
    return (
      <CodeEditor
        width={450}
        height={400}
        mode="json"
        readOnly
        showLineNumbers={false}
        showGutter={false}
        displayIndentGuides={false}
        value={JSON.parse(error)}
        />
    );
  }

  if (isHTML(error)) {
    return <RawHtml html={error} />;
  }

  // remaining case must be plain text error msg.
  return error;
};

export default function PingMessageSnackbar({ commStatus, onClose, onCancelTask }) {
  const { commState, message } = commStatus;
  const variant = commStateToVariantType[commState];
  const classes = useStyles();

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
      <NotificationToaster
        variant={variant || 'info'}
        size="medium"
        fullWidth
        onClose={onClose}>
        <div className={classes.errorText}>
          {formatError(message[0])}
        </div>
      </NotificationToaster>
    </Snackbar>);
}
