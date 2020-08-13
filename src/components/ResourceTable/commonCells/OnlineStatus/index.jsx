import React from 'react';
import StatusCircle from '../../../StatusCircle';

export default function OnlineStatus({offline}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusCircle size="small" variant={offline ? 'error' : 'success'} />
      {offline ? 'Offline' : 'Online'}
    </div>
  );
}
