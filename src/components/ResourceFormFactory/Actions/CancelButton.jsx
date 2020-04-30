import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const CancelButton = props => {
  const { onCancel, classes } = props;

  return (
    <Button
      data-test="cancel"
      onClick={onCancel}
      className={classes.actionButton}
      variant="text"
      color="primary">
      Cancel
    </Button>
  );
};

export default withStyles(styles)(CancelButton);
