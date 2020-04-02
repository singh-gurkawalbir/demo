import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
// TODO: Azhar : Replace icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const useStyles = makeStyles(theme => ({
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
    // TODO: Dave network snackbar variant is error typography and background both are in red color, temp fix.
    '& > [class*="Error"]': {
      color: '#fff',
    },
  },
  snackbarContentWrapper: {
    '& > div:first-child': {
      maxWidth: '90%',
      wordBreak: 'break-word',
    },
  },
  flexGrow: 0,
  justifyContent: 'center',
  textAlign: 'center',
}));
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export default function ClosableSnackbarContent(props) {
  const { message, onClose, variant } = props;
  const classes = useStyles();
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], classes.snackbarContentWrapper)}
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
    />
  );
}
