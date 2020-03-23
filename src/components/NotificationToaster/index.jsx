import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
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
    backgroundColor: fade(theme.palette.success.main, 0.1),
    '& svg': {
      color: theme.palette.success.main,
    },
  },
  error: {
    backgroundColor: fade(theme.palette.error.main, 0.1),
    '& svg': {
      color: theme.palette.error.main,
    },
  },
  info: {
    backgroundColor: fade(theme.palette.info.main, 0.1),
    '& svg': {
      color: theme.palette.info.main,
    },
  },
  warning: {
    backgroundColor: fade(theme.palette.warning.main, 0.1),
    '& svg': {
      color: theme.palette.warning.main,
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
        {...other}
      />
    </div>
  );
}

export default NotificationToaster;
