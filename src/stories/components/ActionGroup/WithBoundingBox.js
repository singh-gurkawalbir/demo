import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';

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
