import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    paddingBottom: 5,
  },
};

function CardTitle(props) {
  const { classes, children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default withStyles(styles)(CardTitle);
