import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    margin: [[0, 5]],
    background: theme.palette.background.default,
    borderRadius: '50%',
    display: 'inline-block',
    marginBottom: '5px',
  },
  large: {
    width: 24,
    height: 24,
  },
  small: {
    width: 12,
    height: 12,
    // TODO: Azhar, possibly there is a better way? I added bottom margin
    // to align the small dot better. it was not visually centered with the
    // text and right arrow... If the solution below is good, erase this
    // comment.
    marginBottom: 3, // used to properly center small dot with text.
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
};

export default StatusCircle;
