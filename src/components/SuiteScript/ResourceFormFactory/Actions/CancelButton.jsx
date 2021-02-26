import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function CancelButton(props) {
  const { onCancel, cancelButtonLabel } = props;
  const classes = useStyles();

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
}

