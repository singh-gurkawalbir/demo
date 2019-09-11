import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
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
  const { loading, className, ...rest } = props;
  const progress = (
    <CircularProgress color="primary" className={className} {...rest} />
  );

  return loading ? (
    <div className={classNames(classes.center, className)}>{progress}</div>
  ) : (
    progress
  );
}

export default Spinner;
