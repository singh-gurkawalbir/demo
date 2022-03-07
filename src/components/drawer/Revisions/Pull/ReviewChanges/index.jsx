import React from 'react';
import RightDrawer from '../../../Right';

export default function ReviewChanges() {
  return (
    <RightDrawer
      path="pull/:revId/review"
      variant="temporary"
      height="tall"
      width="full">
      <div> test </div>
    </RightDrawer>
  );
}
