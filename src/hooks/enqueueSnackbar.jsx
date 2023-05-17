import React, { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import { TextButton } from '@celigo/fuse-ui';
import CloseIcon from '../components/icons/CloseIcon';

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const myEnqueueSnackbar = useCallback(
    ({
      message,
      variant = 'success',
      showUndo,
      handleClose,
      key,
      preventDuplicate = false,
      autoHideDuration = 5000,
      persist = false,
    }) =>
      enqueueSnackbar(message, {
        variant,
        persist,
        key,
        preventDuplicate,
        style: { whiteSpace: 'pre-line' },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        // eslint-disable-next-line react/display-name
        action: key => (
          <>
            {showUndo && (
              <TextButton
                onClick={() => {
                  closeSnackbar(key);
                  handleClose && handleClose(null, 'undo');
                }}>
                UNDO
              </TextButton>
            )}
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => {
                closeSnackbar(key);
                handleClose && handleClose(null, 'close');
              }}
              size="large">
              <CloseIcon />
            </IconButton>
          </>
        ),
        onClose: (event, reason) => {
          // Possible reasons are 'maxsnack', 'clickaway', 'instructed' and 'timeout'
          // We need to avoid unnecessary calling of handleClose other than timeout
          // which gets triggered on automatic close of snackbar
          if (reason === 'timeout') {
            handleClose && handleClose(event, reason);
          }
        },
        autoHideDuration,
      }),
    [closeSnackbar, enqueueSnackbar]
  );

  return [myEnqueueSnackbar, closeSnackbar];
}
