import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import { fade, makeStyles } from '@material-ui/core/styles';
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
    backgroundColor: fade(theme.palette.background.success, 0.1),
    '& svg': {
      color: theme.palette.background.success,
    },
  },
  error: {
    backgroundColor: fade(theme.palette.background.error, 0.1),
    '& svg': {
      color: theme.palette.background.error,
    },
  },
  info: {
    backgroundColor: fade(theme.palette.background.info, 0.1),
    '& svg': {
      color: theme.palette.background.info,
    },
  },
  warning: {
    backgroundColor: fade(theme.palette.background.warning, 0.1),
    '& svg': {
      color: theme.palette.background.warning,
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
    padding: '8px',
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

export default NotificationToaster;
