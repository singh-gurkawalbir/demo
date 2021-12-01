import React from 'react';
import {makeStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    padding: 10,
    display: 'flex',
    maxWidth: 720,
  },
});

export default function WithBoundingBox(Story, context) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Story {...context} />
    </Paper>
  );
}
