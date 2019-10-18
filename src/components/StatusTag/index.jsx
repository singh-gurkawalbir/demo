import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5, 1),
    fontSize: 12,
    borderRadius: 4,
    display: 'inline-block',
    border: '1px solid',
  },
  default: {
    background: theme.palette.secondary.lightest,
    borderColor: theme.palette.secondary.lightest,
    color: theme.palette.getContrastText(theme.palette.secondary.lightest),
  },
  // TODO: Azhar, surely we can find these values in the theme?
  // or are all these new colors? lets talk about this. We should
  // not use, hex values anywhere in out JSX code... only in the theme.
  // There are possibly some edge cases we need to, but this component
  // is not one of those cases.
  success: {
    backgroundColor: '#4CBB02',
    borderColor: '#4CBB02',
    color: theme.palette.getContrastText('#4CBB02'),
  },
  error: {
    backgroundColor: '#FF3C3C',
    borderColor: '#FF3C3C',
    color: theme.palette.getContrastText('#FF3C3C'),
  },
  warn: {
    backgroundColor: '#FFB30C',
    borderColor: '#FFB30C',
    color: theme.palette.getContrastText('#FFB30C'),
  },
  info: {
    backgroundColor: '#00A1E1',
    borderColor: '#00A1E1',
    color: theme.palette.getContrastText('#00A1E1'),
  },
  realtime: {
    backgroundColor: '#95ABBC',
    borderColor: '#95ABBC',
    color: theme.palette.getContrastText('#95ABBC'),
  },
}));

function StatusTag(props) {
  const { variant = 'default', className, children, ...other } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, classes[variant], className)} {...other}>
      {children}
    </div>
  );
}

StatusTag.propTypes = {
  variant: PropTypes.oneOf([
    'default',
    'info',
    'warn',
    'error',
    'success',
    'realtime',
  ]),
};

StatusTag.defaultProps = {
  variant: 'default',
};

export default StatusTag;
