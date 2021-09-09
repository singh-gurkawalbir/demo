import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
  },
}));

export default function Results({results}) {
  const classes = useStyles();

  if (!results?.length) {
    return (
      <Typography>No results</Typography>
    );
  }

  return (
    <div className={classes.root}>
      {JSON.stringify(results)}
    </div>
  );
}
