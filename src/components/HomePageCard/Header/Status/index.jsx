import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import NavigateNext from '@material-ui/icons/NavigateNext';

const usestyles = makeStyles(theme => ({
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
    lineHeight: '19px',
    textTransform: 'initial',
    fontSize: 15,
    fontFamily: 'Source Sans Pro',
  },
  icon: {
    fontSize: 20,
  },
}));

function Status(props) {
  const classes = usestyles();
  const { children, count, label } = props;

  return (
    <div className={classNames(classes.root)}>
      <Button variant="text" className={classes.wrapper}>
        <span>{children} </span>
        <span className={classes.counts}>{count}</span>
        <span className={classes.label}>{label}</span>
        <span className={classes.icon}>
          <NavigateNext />
        </span>
      </Button>
    </div>
  );
}

export default Status;
