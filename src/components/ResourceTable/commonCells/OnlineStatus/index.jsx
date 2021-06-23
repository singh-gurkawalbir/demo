import React from 'react';
import StatusButton from '../../../Buttons/StatusButton';
// import StatusCircle from '../../../StatusCircle';

export default function OnlineStatus({offline}) {
  return (
    <StatusButton variant={offline ? 'error' : 'success'} type="text">
      {offline ? 'Offline' : 'Online'}
    </StatusButton>
  );
}
