import React from 'react';
import { SvgIcon } from '@mui/material/';

export default function DiamondIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m0,12l12,-12l12,12l-12,12l-12,-12z" />
    </SvgIcon>
  );
}
