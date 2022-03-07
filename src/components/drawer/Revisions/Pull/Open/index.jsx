import React from 'react';
import RightDrawer from '../../../Right';

export default function OpenPull() {
  return (
    <RightDrawer
      path="pull/:revId/open"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
