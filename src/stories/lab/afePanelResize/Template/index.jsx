import React from 'react';
import { makeStyles } from '@material-ui/core';
import ResizeProto from '../Prototype';

const useStyles = makeStyles(() => ({
  content: {
    height: 'calc(100vh - 32px)',
  },
}));

export default function Template() {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <ResizeProto />
    </div>
  );
}
