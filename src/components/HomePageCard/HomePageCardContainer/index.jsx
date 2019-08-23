import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
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
    '&:hover': {
      margin: [[-5, 0, -5, 0]],
      boxShadow: `0 0 7px rgba(0,0,0,0.1)`,
      borderColor: theme.palette.background.main,
    },
  },
  center: {
    textAlign: 'center',
  },
});

function HomePageCardContainer(props) {
  const { classes, children } = props;

  return (
    <Paper className={classNames(classes.wrapper)} elevation={0}>
      {children}
    </Paper>
  );
}

export default withStyles(styles)(HomePageCardContainer);
