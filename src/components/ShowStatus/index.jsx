import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import NotificationToaster from '../NotificationToaster';

const useStyles = makeStyles(theme => ({
  customWrapper: {
    backgroundColor: 'transparent',
    margin: '10px 0px',
    border: '1px solid',
    borderRadius: 4,
    maxWidth: 'unset',
    boxShadow: 'unset',
    wordBreak: 'break-word',
    width: '100%',
    borderColor: theme.palette.secondary.lightest,
    '& div:first-child': {
      justifyContent: 'flex-start',
      maxWidth: '80%',
      paddingLeft: 0,
      '& > a': {
        margin: '0px 5px',
      },
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
  children: {
    '& a': {
      padding: '0px 5px',
    },
  },
  error: {
    borderColor: theme.palette.error.main,
    '&:before': {
      background: theme.palette.error.main,
    },
  },
  success: {
    borderColor: theme.palette.success.main,
    '&:before': {
      background: theme.palette.success.main,
    },
  },
  warning: {
    borderColor: theme.palette.warning.main,
    '&:before': {
      background: theme.palette.warning.main,
    },
  },
  info: {
    borderColor: theme.palette.info.main,
    '&:before': {
      background: theme.palette.info.main,
    },
  },
}));

function ShowStatus(props) {
  const { children, className, variant } = props;
  const classes = useStyles(props);

  return (
    <NotificationToaster
      variant={variant}
      className={clsx(classes.customWrapper, classes[variant], className)}>
      <div className={classes.children}>{children}</div>
    </NotificationToaster>
  );
}

export default ShowStatus;
