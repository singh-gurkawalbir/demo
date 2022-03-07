import React from 'react';
import RightDrawer from '../../Right';

export default function CreateSnapshot() {
  return (
    <RightDrawer
      path="snapshot/:revId/open"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
