import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1.5, 3),
  },
}));

export default function DrawerSubHeader({ children, className }) {
  const classes = useStyles();

  return (
    <div data-public className={clsx(classes.drawerHeader, className)}>
      {/* Typically children are the action icons/buttons */}
      {children}
    </div>
  );
}
