import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ArrowRightIcon from '../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
  },
  wrapper: {
    padding: '0px',
    color: theme.palette.text.primary,
  },
  label: {
    textTransform: 'initial',
  },
}));

function Status({ children, label, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Button
        data-test="headerStatus"
        variant="text"
        className={classes.wrapper}>
        {children}
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
