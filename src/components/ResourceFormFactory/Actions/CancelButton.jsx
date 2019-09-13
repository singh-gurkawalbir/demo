import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const CancelButton = props => {
  const { onCancel, cancelButtonLabel, classes } = props;

  return (
    <Button
      onClick={onCancel}
      className={classes.actionButton}
      variant="contained"
      color="secondary">
      {cancelButtonLabel || 'Reset'}
    </Button>
  );
};

export default withStyles(styles)(CancelButton);
