import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    padding: theme.spacing(3, 3, 0),
    flex: 1,
    overflow: 'auto',
  },
  drawerContentWithoutPadding: {
    flex: 1,
    overflow: 'auto',
  },
}));

export default function DrawerContent({ children, fullWidth }) {
  const classes = useStyles();

  return (
    <div
      className={clsx({
        [classes.drawerContent]: !fullWidth,
        [classes.drawerContentWithoutPadding]: fullWidth,
      })}>
      {children}
    </div>
  );
}
