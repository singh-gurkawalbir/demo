import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const CancelButton = props => {
  const { onCancel, label, classes } = props;

  return (
    <Button
      onClick={onCancel}
      className={classes.actionButton}
      variant="contained">
      {label || 'Reset'}
    </Button>
  );
};

export default withStyles(styles)(CancelButton);
