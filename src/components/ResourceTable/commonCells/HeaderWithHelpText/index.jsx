import React from 'react';
import Help from '../../../Help';

export default function HeaderWithHelpText({ title, helpKey }) {
  return (
    <span>{title}
      <Help
        title={title}
        helpKey={helpKey}
        sx={{ml: 0.5}}
        />
    </span>
  );
}
