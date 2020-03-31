import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';
import SuccessIcon from '../icons/SuccessIcon';
import WarningIcon from '../icons/WarningIcon';
import InfoIcon from '../icons/InfoIcon';
import ErrorIcon from '../icons/ErrorIcon';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    left: '0px',
    right: '0px',
    top: '0px',
    background: theme.palette.background.paper,
    zIndex: '2',
    boxSizing: 'border-box',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0, 2),
    minHeight: '50px',
    transition: 'max-height .5s ease',
    '& > div:first-child': {
      width: '85%',
      display: 'flex',
      justifyContent: 'center',
    },
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: theme.palette.secondary.lightest,
      left: 0,
      top: 0,
    },
  },
  small: {
    borderRadius: theme.spacing(0.5),
    maxWidth: '350px',
    display: 'inline-flex',
  },
  large: {
    border: '1px solid',
    maxWidth: '100%',
    boxShadow: 'none',
    '& > div:first-child': {
      justifyContent: 'flex-start',
    },
  },
  success: {
    borderColor: theme.palette.success.main,
    '& svg': {
      color: theme.palette.success.main,
    },
    '&:before': {
      background: theme.palette.success.main,
    },
  },
  error: {
    borderColor: theme.palette.error.main,
    '& svg': {
      color: theme.palette.error.main,
    },
    '&:before': {
      background: theme.palette.error.main,
    },
  },
  info: {
    borderColor: theme.palette.info.main,
    '& svg': {
      color: theme.palette.info.main,
    },
    '&:before': {
      background: theme.palette.info.main,
    },
  },
  warning: {
    borderColor: theme.palette.warning.main,
    '& svg': {
      color: theme.palette.warning.main,
    },
    '&:before': {
      background: theme.palette.warning.main,
    },
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
    padding: 0,
    '& svg': {
      color: theme.palette.text.primary,
    },
  },
}));
const variantIcon = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function NotificationToaster(props) {
  const classes = useStyles();
  const {
    className,
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
        className={clsx(
          classes[variant],
          classes[size],
          classes.root,
          className
        )}
        aria-describedby="client-snackbar"
        elevation={1}
        message={
          <div id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {children}
          </div>
        }
        action={
          // show Close Icon only when onClose function is passed.
          onClose && [
            <IconButton
              data-test="closeNotificationToaster"
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}
              className={classes.actionButton}>
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]
        }
        {...other}
      />
    </div>
  );
}

export default NotificationToaster;
