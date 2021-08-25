import React from 'react';
import { makeStyles } from '@material-ui/core';
import Proto from '../Prototype';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
  },
});

export default function Template(args) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Proto {...args} />
    </div>
  );
}
