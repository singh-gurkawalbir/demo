import React from 'react';
import { OutlinedButton as FuseUiOutlinedButton } from '@celigo/fuse-ui';

export function GoogleButton({sx, ...rest}) {
  return (
    <FuseUiOutlinedButton
      sx={[
        {
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'divider',
          width: '100%',
          // eslint-disable-next-line no-undef
          background: `url(${CDN_BASE_URI}images/googlelogo.png) 10% center no-repeat`,
          backgroundSize: '16px',
          height: 38,
          fontSize: '16px',
          backgroundColor: 'background.paper',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}
