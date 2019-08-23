import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
});

function FooterActions(props) {
  const { classes, children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default withStyles(styles)(FooterActions);
