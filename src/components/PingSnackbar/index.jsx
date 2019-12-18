import React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ErroredMessageList } from '../NetworkSnackbar';
import { PING_STATES } from '../../reducers/comms/ping';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};
const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  snackbarContentWrapper: {
    '& > div:first-child': {
      maxWidth: '90%',
    },
  },
  flexGrow: 0,
  justifyContent: 'center',
  textAlign: 'center',
});

function ClosableSnackbar(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(
        classes[variant],
        classes.snackbarContentWrapper,
        className
      )}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={
        variant !== 'info' && [
          <IconButton
            data-test="closePingSnackbar"
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]
      }
      {...other}
    />
  );
}

const WrappedClosableSnackbar = withStyles(styles1)(ClosableSnackbar);
const styles2 = theme => ({
  margin: {
    marginTop: theme.spacing(1),
  },
});
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
        onClick={props.onHandleCancel}>
        Click here to cancel this Test call
      </Button>
    </div>
    <div>
      <p />
    </div>
    <LinearProgress />
  </div>
);

class PingSnackbar extends React.Component {
  generateMessageBasedOnState = (commState, messages, onHandleCancel) => {
    if (commState === PING_STATES.LOADING)
      return <CancellableSpinner onHandleCancel={onHandleCancel} />;
    else if (commState === PING_STATES.ERROR) {
      return <ErroredMessageList messages={messages} />;
    } else if (
      commState === PING_STATES.SUCCESS ||
      commState === PING_STATES.ABORTED
    ) {
      return messages;
    }
  };
  render() {
    const { commStatus, onHandleClose, onHandleCancelTask } = this.props;
    const { commState, message } = commStatus;
    const variant = commStateToVariantType[commState];
    const msg = this.generateMessageBasedOnState(
      commState,
      message,
      onHandleCancelTask
    );

    if (!commState) return null;

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open
          autoHideDuration={6000}>
          <WrappedClosableSnackbar
            onClose={onHandleClose}
            variant={variant || 'info'}
            message={msg}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withStyles(styles2)(PingSnackbar);
