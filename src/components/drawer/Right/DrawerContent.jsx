import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    flex: 1,
    overflow: 'auto',
  },
  withPadding: {
    padding: theme.spacing(3, 3, 0),
  },
}));

export default function DrawerContent({ children, noPadding, className }) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.drawerContent, { [classes.withPadding]: !noPadding }, className)}>
      {children}
    </div>
  );
}
