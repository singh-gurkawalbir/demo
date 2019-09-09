import Paper from '@material-ui/core/Paper';
import { makeStyles, fade } from '@material-ui/styles';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: 4,
    padding: 22,
    minWidth: 319,
    minHeight: 319,
    maxWidth: 319,
    boxSizing: 'border-box',
    border: '1px solid',
    cursor: 'pointer',
    // Azhar, since border is 1px, it is REALLY hard for a user to know what color
    // we use.. I think this is perfect for fade()...
    // please tweak as needed. I'm just guessing here to remove
    // this custom background variable...
    // borderColor: theme.palette.background.arrowAfter, // was neutral3
    borderColor: fade(theme.palette.common.black, 0.2),
    transitionProperty: 'all',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeIn,
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      margin: [[-5, 0, -5, 0]],
      boxShadow: `0 0 7px rgba(0,0,0,0.1)`,
      borderColor: theme.palette.primary.light,
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
  const classes = useStyles();
  const { children } = props;

  return (
    <Paper className={classNames(classes.wrapper)} elevation={0}>
      <div>{children}</div>
    </Paper>
  );
}

export default HomePageCardContainer;
