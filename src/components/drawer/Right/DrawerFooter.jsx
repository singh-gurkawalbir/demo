import clsx from 'clsx';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  drawerFooter: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
    padding: theme.spacing(2, 3),
    display: 'flex',
  },
}));

export default function DrawerFooter({ children, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.drawerFooter, className)}>
      {children}
    </div>
  );
}
