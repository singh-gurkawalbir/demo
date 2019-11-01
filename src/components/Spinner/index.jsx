import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  center: {
    textAlign: 'center',
  },
});

/**
 * Render an indeterminate spinning indicator.
 */
function Spinner(props) {
  const classes = useStyles();
  const { loading, color, className, ...rest } = props;
  const progress = (
    <CircularProgress
      color={color || 'inherit'}
      className={className}
      {...rest}
    />
  );

  return loading ? (
    <div className={classNames(classes.center, className)}>{progress}</div>
  ) : (
    progress
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
};

export default Spinner;
