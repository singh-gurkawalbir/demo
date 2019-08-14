import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '../icons/CloseIcon';
import SuccessIcon from '../icons/SuccessIcon';
import WarningIcon from '../icons/WarningIcon';
import InfoIcon from '../icons/InfoIcon';
import ErrorIcon from '../icons/ErrorIcon';

const styles = theme => ({
  root: {
    position: 'relative',
    left: '0px',
    right: '0px',
    top: '0px',
    zIndex: '2',
    boxSizing: 'border-box',
    borderRadius: '0px',
    padding: '0px 15px',
    minHeight: '50px',
    transition: 'max-height .5s ease',
    '& > div:first-child': {
      width: '82%',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  small: {
    maxWidth: '350px',
    display: 'inline-flex',
  },
  large: {
    maxWidth: '100%',
    '& > div:first-child': {
      width: '95%',
      boxSizing: 'border-box',
      paddingLeft: '24px',
    },
  },
  success: {
    backgroundColor: lighten(theme.palette.background.success, 0.9),
    '& svg': {
      color: theme.palette.background.success,
    },
  },
  error: {
    backgroundColor: lighten(theme.palette.background.error, 0.9),
    '& svg': {
      color: theme.palette.background.error,
    },
  },
  info: {
    backgroundColor: lighten(theme.palette.background.info, 0.9),
    '& svg': {
      color: theme.palette.background.info,
    },
  },
  warning: {
    backgroundColor: lighten(theme.palette.background.warning, 0.9),
    '& svg': {
      color: theme.palette.background.warning,
    },
  },
  icon: {
    fontSize: 24,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  actionButton: {
    color: theme.palette.text.primary,
    '& svg': {
      width: '10px',
      height: '10px',
      color: theme.palette.text.primary,
      fontSize: 16,
    },
  },
});
const variantIcon = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function NotificationToaster(props) {
  const {
    className,
    classes,
    message,
    children,
    onClose,
    variant,
    size = 'small',
    ...other
  } = props;
  const Icon = variantIcon[variant];

  return (
    <div>
      <SnackbarContent
        className={classNames(classes[variant], classes[size], classes.root)}
        aria-describedby="client-snackbar"
        elevation={1}
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {children}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={onClose}
            className={classes.actionButton}>
            <CloseIcon className={classNames(classes.icon)} />
          </IconButton>,
        ]}
        {...other}
      />
    </div>
  );
}

export default withStyles(styles)(NotificationToaster);
