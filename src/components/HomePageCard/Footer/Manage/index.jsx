import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    marginRight: 10,
    padding: 7,
    '&:hover': {
      background: theme.palette.background.editorInner,
    },
  },
});

function Manage(props) {
  const { classes, children } = props;

  return (
    <IconButton aria-label="manage" className={classes.wrapper}>
      {children}
    </IconButton>
  );
}

export default withStyles(styles)(Manage);
