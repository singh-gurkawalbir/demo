import React from 'react';
import RightDrawer from '../../../Right';

export default function OpenRevert() {
  return (
    <RightDrawer
      path="revert/:tempRevId/open/:to/revision/:revisionId"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
