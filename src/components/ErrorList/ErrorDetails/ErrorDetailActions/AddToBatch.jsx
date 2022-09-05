import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import SelectError from './SelectError';

const useStyles = makeStyles(theme => ({
  action: {
    margin: theme.spacing(1, 0),
  },
}));

export default function AddToBatch({
  error,
  flowId,
  resourceId,
  isResolved,
}) {
  const classes = useStyles();

  return (
    <div className={classes.action}>
      <SelectError
        error={error} flowId={flowId} resourceId={resourceId} isResolved={isResolved}
        label="Add to batch" />
    </div>
  );
}
