import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
});

function SpacedContainer(props) {
  const { classes, children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default withStyles(styles)(SpacedContainer);
