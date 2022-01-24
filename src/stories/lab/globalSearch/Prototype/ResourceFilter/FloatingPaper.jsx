import clsx from 'clsx';
import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: 2,
  },
}));

export default function FloatingPaper({className, children}) {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.root, className)} elevation={3}>
      {children}
    </Paper>
  );
}
