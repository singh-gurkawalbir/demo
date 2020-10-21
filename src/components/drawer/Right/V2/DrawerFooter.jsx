import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
  },
}));

export default function DrawerHeader({ children }) {
  const classes = useStyles();

  return (
    <div
      className={classes.root}>
      {children}
    </div>
  );
}
