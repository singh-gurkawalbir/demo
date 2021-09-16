import clsx from 'clsx';
import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2),
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    top: 50,
  },

}));

export default function FloatingPaper({className, children}) {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.root, className)} elevation={5} >
      {children}
    </Paper>
  );
}
