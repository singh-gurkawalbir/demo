import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3, 0),
    flex: 1,
    overflow: 'auto',
  },
  // if type = paper, this style is applied.
  // we have 2
  paper: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

export default function DrawerHeader({ type, children }) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, classes[type])}>
      {children}
    </div>
  );
}
