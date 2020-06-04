import React from 'react';
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
      data-test="cancel"
      onClick={onCancel}
      className={classes.actionButton}
      variant="text"
      color="primary">
      {cancelButtonLabel || 'Reset'}
    </Button>
  );
};

export default withStyles(styles)(CancelButton);
