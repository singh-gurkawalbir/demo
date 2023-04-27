import clsx from 'clsx';
import React from 'react';
import { Handle } from 'reactflow';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  defaultHandle: {
    border: 0,
    width: '1px !important',
    height: '1px !important',
    backgroundColor: 'transparent',
  },
}));

export default function DefaultHandle({className, ...props}) {
  const classes = useStyles();

  return (
    <Handle className={clsx(classes.defaultHandle, className)} {...props} style={{minWidth: 0}} />
  );
}
