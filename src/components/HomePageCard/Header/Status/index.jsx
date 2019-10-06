import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
  },
  wrapper: {
    padding: '0px',
    color: theme.palette.text.primary,
  },
  counts: {
    marginRight: 5,
  },
  label: {
    textTransform: 'initial',
  },
  icon: {
    '& svg': {
      fontSize: 22,
    },
  },
}));

function Status(props) {
  const classes = useStyles();
  const { children, count, label } = props;

  return (
    <div className={classNames(classes.root)}>
      <Button
        data-test="headerStatus"
        variant="text"
        className={classes.wrapper}>
        {children}
        {count && (
          <Typography
            variant="body2"
            component="span"
            className={classes.counts}>
            {count}
          </Typography>
        )}
        <Typography variant="body2" component="span" className={classes.label}>
          {label}
        </Typography>
        <span className={classes.icon}>
          <ArrowRightIcon />
        </span>
      </Button>
    </div>
  );
}

export default Status;
