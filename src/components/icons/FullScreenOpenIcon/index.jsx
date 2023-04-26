import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export const path = `M8.88,21.15H3.59c-0.41,0-0.74-0.33-0.74-0.74v-5.28c0-0.33-0.27-0.6-0.6-0.6s-0.6,0.27-0.6,0.6v5.28
c0,1.07,0.87,1.94,1.94,1.94h5.28c0.33,0,0.6-0.27,0.6-0.6S9.21,21.15,8.88,21.15z M8.88,1.65H3.59c-1.07,0-1.94,0.87-1.94,1.94
v5.29c0,0.33,0.27,0.6,0.6,0.6s0.6-0.27,0.6-0.6V3.59c0-0.41,0.33-0.74,0.74-0.74h5.28c0.33,0,0.6-0.27,0.6-0.6S9.21,1.65,8.88,1.65
z M20.41,1.65h-5.28c-0.33,0-0.6,0.27-0.6,0.6s0.27,0.6,0.6,0.6h5.28c0.41,0,0.74,0.33,0.74,0.74v5.29c0,0.33,0.27,0.6,0.6,0.6
s0.6-0.27,0.6-0.6V3.59C22.35,2.52,21.48,1.65,20.41,1.65z M21.75,14.52c-0.33,0-0.6,0.27-0.6,0.6v5.28c0,0.41-0.33,0.74-0.74,0.74
h-5.28c-0.33,0-0.6,0.27-0.6,0.6s0.27,0.6,0.6,0.6h5.28c1.07,0,1.94-0.87,1.94-1.94v-5.28C22.35,14.79,22.08,14.52,21.75,14.52z`;

export default function FullScreenOpenIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d={path} />
    </SvgIcon>
  );
}
