import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    margin: [[0, 5]],
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '5px',
  },
  large: {
    width: 24,
    height: 24,
  },
  small: {
    width: 12,
    height: 12,
    marginBottom: '0px',
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
}));

function StatusCircle({ variant, size = 'large' }) {
  const classes = useStyles();

  return (
    <span
      className={classNames(classes[size], classes[variant], classes.root)}
    />
  );
}

StatusCircle.propTypes = {
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  size: PropTypes.oneOf(['small', 'large']),
};

export default StatusCircle;
