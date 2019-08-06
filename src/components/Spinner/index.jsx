import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  center: {
    textAlign: 'center',
  },
};

/**
 * Render an indeterminate spinning indicator.
 */
function Spinner(props) {
  const { loading, classes, className, ...rest } = props;
  const progress = (
    <CircularProgress color="primary" className={className} {...rest} />
  );

  return loading ? (
    <div className={classNames(classes.center, className)}>{progress}</div>
  ) : (
    progress
  );
}

export default withStyles(styles)(Spinner);
