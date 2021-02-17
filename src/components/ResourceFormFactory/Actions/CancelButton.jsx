import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));
const CancelButton = props => {
  const classes = useStyles();
  const { onCancel} = props;

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

export default CancelButton;
