import React from 'react';
import RightDrawer from '../../../Right';

export default function ReviewRevertChanges() {
  return (
    <RightDrawer
      path="revert/:tempRevId/review/:to/revision/:revisionId"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
