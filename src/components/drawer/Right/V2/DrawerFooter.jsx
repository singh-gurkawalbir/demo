import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
  },
}));

export default function DrawerHeader({ children, className }) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}>
      {children}
    </div>
  );
}
