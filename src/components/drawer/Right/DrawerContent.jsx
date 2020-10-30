import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    padding: theme.spacing(3, 3, 0),
    flex: 1,
    overflow: 'auto',
  },
}));

export default function DrawerHeader({ children }) {
  const classes = useStyles();

  return (
    <div
      className={classes.drawerContent}>
      {children}
    </div>
  );
}
