import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5, 1),
    fontSize: 12,
    borderRadius: 4,
    display: 'inline-block',
  },
  default: {
    background: theme.palette.secondary.lightest,
    color: theme.palette.getContrastText(theme.palette.secondary.lightest),
  },
  realtime: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.getContrastText(theme.palette.secondary.light),
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
  },
  info: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.getContrastText(theme.palette.info.main),
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.getContrastText(theme.palette.warning.main),
  },
}));

function StatusTag(props) {
  const { variant = 'default', className, label, ...other } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, classes[variant], className)} {...other}>
      {label}
    </div>
  );
}

StatusTag.propTypes = {
  variant: PropTypes.oneOf([
    'default',
    'info',
    'warning',
    'error',
    'success',
    'realtime',
  ]),
};

StatusTag.defaultProps = {
  variant: 'default',
};

export default StatusTag;
