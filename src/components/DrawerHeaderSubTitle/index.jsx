import React from 'react';
import { Typography } from '@material-ui/core';

export default function DrawerHeaderSubTitle({ children, className}) {
  return (
    <Typography variant="body2" component="div" className={className}>
      {children}
    </Typography>
  );
}

