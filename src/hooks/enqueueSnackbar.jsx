import { Fragment } from 'react';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const myEnqueueSnackbar = ({
    message,
    variant = 'success',
    showUndo,
    handleClose,
    autoHideDuration = 5000,
  }) =>
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      // eslint-disable-next-line react/display-name
      action: key => (
        <Fragment>
          {showUndo && (
            <Button
              onClick={() => {
                closeSnackbar(key);
                handleClose && handleClose(null, 'undo');
              }}>
              UNDO
            </Button>
          )}
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => {
              closeSnackbar(key);
              handleClose && handleClose(null, 'close');
            }}>
            <CloseIcon />
          </IconButton>
        </Fragment>
      ),
      onClose: (event, reason) => {
        handleClose && handleClose(event, reason);
      },
      autoHideDuration,
    });

  return [myEnqueueSnackbar, closeSnackbar];
}
