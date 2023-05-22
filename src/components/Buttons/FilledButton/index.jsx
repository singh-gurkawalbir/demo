import React from 'react';
import { FilledButton as FuseUiFilledButton } from '@celigo/fuse-ui';

export function SubmitButton({sx, ...rest}) {
  return (
    <FuseUiFilledButton
      sx={[
        {
          width: '100%',
          borderRadius: '4px',
          height: 38,
          fontSize: '16px',
          mt: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}
