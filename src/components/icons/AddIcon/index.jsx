import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export const path = `M17.989,11.4h-5.4V6c0-0.332-0.269-0.6-0.6-0.6s-0.6,0.269-0.6,0.6v5.4h-5.4c-0.332,0-0.6,0.269-0.6,0.6
c0,0.331,0.269,0.6,0.6,0.6h5.4V18c0,0.331,0.269,0.6,0.6,0.6s0.6-0.269,0.6-0.6v-5.4h5.4c0.331,0,0.6-0.269,0.6-0.6
C18.589,11.668,18.32,11.4,17.989,11.4z`;

export default function AddIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}
