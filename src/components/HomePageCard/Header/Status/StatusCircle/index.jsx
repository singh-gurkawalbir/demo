import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const usestyles = makeStyles(theme => ({
  root: {
    margin: [[0, 5]],
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
  },
  large: {
    width: 24,
    height: 24,
  },
  small: {
    width: 12,
    height: 12,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.background.info,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
}));

function StatusCircle({ variant, size = 'large' }) {
  const classes = usestyles();

  return (
    <span
      className={classNames(classes[size], classes[variant], classes.root)}
    />
  );
}

StatusCircle.propTypes = {
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
};

export default StatusCircle;
