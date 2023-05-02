import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
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
    minHeight: 50,
    transition: 'max-height .5s ease',
    alignItems: 'flex-start',
    '& > div:first-child': {
      // width: props => (props.fullWidth ? '100%' : '85%'),
      display: 'flex',
      justifyContent: 'center',
    },
    '&:before': {
      content: '""',
      width: 3,
      height: '100%',
      position: 'absolute',
      background: theme.palette.secondary.lightest,
      left: 0,
      top: 0,
    },
  },
  small: {
    borderRadius: theme.spacing(0.5),
    maxWidth: 350,
    display: 'inline-flex',
    '&:before': { width: 5 },
  },
  medium: {
    borderRadius: theme.spacing(0.5),
    maxWidth: 700,
    display: 'inline-flex',
    '&:before': { width: 5 },
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
    borderColor: `${theme.palette.success.main} !important`,
    '& svg': {
      color: theme.palette.success.main,
    },
    '&:before': {
      background: theme.palette.success.main,
    },
  },
  error: {
    borderColor: `${theme.palette.error.main} !important`,
    '& svg': {
      color: theme.palette.error.main,
    },
    '&:before': {
      background: theme.palette.error.main,
    },
  },
  info: {
    borderColor: `${theme.palette.info.main} !important`,
    '& svg': {
      color: theme.palette.info.main,
    },
    '&:before': {
      background: theme.palette.info.main,
    },
  },
  warning: {
    borderColor: `${theme.palette.warning.main} !important`,
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
    color: theme.palette.secondary.main,
  },
  actionButton: {
    padding: 0,
    marginTop: theme.spacing(1),
    '& svg': {
      color: theme.palette.secondary.main,
    },
  },
  icon: {
    alignSelf: 'flex-start',
  },
  transparent: {
    background: 'none',
    fontFamily: 'source sans pro',
    fontSize: 13,
    border: '1px solid',
    minHeight: 'unset',
    boxShadow: 'none',
    maxWidth: 'unset',
    '&:before': {
      display: 'none',
    },
    '& > .MuiSnackbarContent-message': {
      justifyContent: 'flex-start',
      '&:first-child': {
        justifyContent: 'flex-start',
      },
    },
    '& >.MuiTypography-root': {
      fontSize: 13,
    },
    '& > * svg': {
      fontSize: '17px !important',
      alignSelf: 'center',
    },
    '& > div:first-child': {
      padding: 0,
      width: '100%',
    },
  },
  italic: {
    fontStyle: 'italic',
  },
  noBorder: {
    border: 'none',
    '&$warning': {
      '& svg': {
        color: theme.palette.warning.main,
      },
    },
    '& svg': {
      color: theme.palette.text.hint,
      marginTop: 2,
      alignSelf: 'flex-start',
    },
  },
}));
const variantIcon = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

/**
 * props.fullWidth : set to true for full width notification.
 */
export default function NotificationToaster(props) {
  const classes = useStyles();
  const {
    className,
    children,
    onClose,
    variant = 'info',
    transparent = false,
    italic = false,
    noBorder = false,
    textSize = '',
    size = 'small',
    ...other
  } = props;
  const Icon = variantIcon[variant];
  const [showSnackbar, setShowSnackbar] = useState(true);

  const onCloseHandler = useCallback(() => {
    if (typeof onClose === 'function') {
      return onClose();
    }
    setShowSnackbar(false);
  }, [onClose]);

  if (!showSnackbar) return null;

  return (
    <SnackbarContent
      className={clsx(
        classes[variant],
        classes[size],
        classes[textSize],
        classes.root,
        {[classes.transparent]: transparent},
        {[classes.italic]: italic},
        {[classes.noBorder]: noBorder},
        {[classes.noBorderWithColorIcons]: noBorder && variant},
        className
      )}
      aria-describedby="client-snackbar"
      elevation={4}
      message={(
        <Typography
          component="div" id="client-snackbar" className={classes.message}
          sx={{ fontSize: props.transparent ? 13 : 17,
          }}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {children}
        </Typography>
      )}
      action={
          // show Close Icon only when onClose function is passed.
          onClose && [
            <IconButton
              data-test="closeNotificationToaster"
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onCloseHandler}
              className={classes.actionButton}
              size="large">
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]
        }
      {...other}
      />
  );
}

NotificationToaster.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['warning', 'error', 'success', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  textSize: PropTypes.oneOf(['small', 'medium', 'large']),
};

NotificationToaster.defaultProps = {
  size: 'small',
};
