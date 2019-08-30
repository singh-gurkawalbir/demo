import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const usestyles = makeStyles(theme => ({
  root: {
    margin: [[0, 5]],
    width: 24,
    height: 24,
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
  },
  success: {
    backgroundColor: theme.palette.background.success,
  },
  error: {
    backgroundColor: theme.palette.background.error,
  },
  info: {
    backgroundColor: theme.palette.background.info,
  },
  warning: {
    backgroundColor: theme.palette.background.warning,
  },
}));

function StatusCircle(props) {
  const classes = usestyles();
  const { variant } = props;

  return <span className={classNames(classes[variant], classes.root)} />;
}

StatusCircle.propTypes = {
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
};

export default StatusCircle;
