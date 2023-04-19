import React from 'react';
import Help from '../../../../Help';

export default function AccessLevelHeader() {
  return (
    <span>Access level
      <Help
        title="Access level"
        helpKey="users.accesslevel"
        sx={{ml: 0.5}}
        disablePortal={false}
        />
    </span>
  );
}
