import clsx from 'clsx';
import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: 2,
  },
}));

export default function FloatingPaper({className, children, label}) {
  const classes = useStyles();

  return (
    <Paper aria-label={label} className={clsx(classes.root, className)} elevation={3}>
      {children}
    </Paper>
  );
}
