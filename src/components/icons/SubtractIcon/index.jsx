import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export const path = `M17.989,12.6h-12c-0.332,0-0.6-0.269-0.6-0.6c0-0.332,0.269-0.6,0.6-0.6h12c0.331,0,0.6,0.269,0.6,0.6
C18.589,12.331,18.32,12.6,17.989,12.6z`;

export default function SubtractIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}
