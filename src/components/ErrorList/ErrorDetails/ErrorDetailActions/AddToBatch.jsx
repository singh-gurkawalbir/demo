import { Typography } from '@material-ui/core';
import React from 'react';
import SelectError from '../../../ResourceTable/errorManagement/cells/SelectError';

export default function AddToBatch({
  error,
  flowId,
  resourceId,
  isResolved,
}) {
  return (
    <div>
      <Typography variant="h4">
        <SelectError error={error} flowId={flowId} resourceId={resourceId} isResolved={isResolved} />
        Add to batch
      </Typography>
    </div>
  );
}
