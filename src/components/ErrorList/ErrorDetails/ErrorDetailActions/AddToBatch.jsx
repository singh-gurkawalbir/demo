import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import SelectError from '../../../ResourceTable/errorManagement/cells/SelectError';

const useStyles = makeStyles(theme => ({
  action: {
    margin: theme.spacing(1),
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
      <Typography variant="h4">
        <SelectError error={error} flowId={flowId} resourceId={resourceId} isResolved={isResolved} />
        Add to batch
      </Typography>
    </div>
  );
}
