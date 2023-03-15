import React from 'react';
import { Typography } from '@mui/material';

export default function DrawerHeaderSubTitle({ children, className}) {
  return (
    <Typography variant="body2" component="div" className={className}>
      {children}
    </Typography>
  );
}

