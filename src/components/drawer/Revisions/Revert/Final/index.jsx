import React from 'react';
import RightDrawer from '../../../Right';

export default function FinalRevert() {
  return (
    <RightDrawer
      path="revert/:tempRevId/final"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
