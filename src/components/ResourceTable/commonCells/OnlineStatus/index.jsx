import React from 'react';
import Status from '../../../Buttons/Status';

export default function OnlineStatus({offline}) {
  return (
    <Status size="small" variant={offline ? 'error' : 'success'} >
      {offline ? 'Offline' : 'Online'}
    </Status>
  );
}
