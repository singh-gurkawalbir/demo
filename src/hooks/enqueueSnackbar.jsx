import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const myEnqueueSnackbar = ({ message, variant = 'success' }) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      // eslint-disable-next-line react/display-name
      action: key => (
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => {
            closeSnackbar(key);
          }}>
          <CloseIcon />
        </IconButton>
      ),
    });
  };

  return [myEnqueueSnackbar];
}
