import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

const usestyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: 4,
    padding: 22,
    minWidth: 319,
    minHeight: 319,
    maxWidth: 319,
    boxSizing: 'border-box',
    border: '1px solid',
    cursor: 'pointer',
    borderColor: theme.palette.background.arrowAfter,
    transition: `all .4s ease`,
    overflow: 'hidden',
    '&:hover': {
      margin: [[-5, 0, -5, 0]],
      boxShadow: `0 0 7px rgba(0,0,0,0.1)`,
      borderColor: theme.palette.background.main,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      minWidth: '100%',
      maxWidth: '100%',
    },
  },
  center: {
    textAlign: 'center',
  },
}));

function HomePageCardContainer(props) {
  const classes = usestyles();
  const { children } = props;

  return (
    <Paper className={classNames(classes.wrapper)} elevation={0}>
      <div>{children}</div>
    </Paper>
  );
}

export default HomePageCardContainer;
