import { withStyles } from '@material-ui/core/styles';

const styles = {
  wrapper: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
};

function Content(props) {
  const { classes, children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default withStyles(styles)(Content);
