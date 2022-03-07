import React from 'react';
import RightDrawer from '../../../Right';

export default function MergePull() {
  return (
    <RightDrawer
      path="pull/:revId/merge"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
