import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
});

function Footer(props) {
  const { classes, children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default withStyles(styles)(Footer);
