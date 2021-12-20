import React from 'react';
import { Typography } from '@material-ui/core';

export default function DrawerSubHeader(props) {
  const {children, title, className} = props;

  return (
    <Typography variant="body2" component="div" className={className}>
      {title}
      {children}
    </Typography>
  );
}

