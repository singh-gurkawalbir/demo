import React from 'react';
import RightDrawer from '../../Right';

export default function ViewRevisionDetails() {
  return (
    <RightDrawer
      path="view/:revId/mode/:mode"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
