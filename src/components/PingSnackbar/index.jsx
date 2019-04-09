import React from 'react';
import PropTypes from 'prop-types';
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
import { COMM_STATES } from '../../reducers/comms';

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
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  w: theme.spacing.unit * 4,
  flexGrow: 0,
  justifyContent: 'center',
  textAlign: 'center',
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
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

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
const styles2 = theme => ({
  margin: {
    marginTop: theme.spacing.unit,
  },
});
const commStateToVariantType = {
  success: 'success',
  loading: 'info',
  error: 'error',
};
const CancellableSpinner = props => (
  <div>
    <div>
      <Button
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

class CustomizedSnackbars extends React.Component {
  generateMessageBasedOnState = (commState, messages, onHandleCancel) => {
    if (commState === COMM_STATES.LOADING)
      return <CancellableSpinner onHandleCancel={onHandleCancel} />;
    else if (commState === COMM_STATES.ERROR) {
      const errors = messages.match(/\[(.*?)\]/g);

      if (!errors) {
        return messages;
      }

      return (
        <ul>
          {errors.map(msg => {
            const removedBraces = msg.substring(1, msg.length - 1);

            return <li key={removedBraces}>{removedBraces}</li>;
          })}
        </ul>
      );
    } else if (commState === COMM_STATES.SUCCESS) {
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
          <MySnackbarContentWrapper
            onClose={onHandleClose}
            variant={variant || 'info'}
            message={msg}
          />
        </Snackbar>
      </div>
    );
  }
}

CustomizedSnackbars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(CustomizedSnackbars);
