import clsx from 'clsx';
import React from 'react';
import { Paper } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: 2,
  },
}));

export default function FloatingPaper({className, children, ariaLabel}) {
  const classes = useStyles();

  return (
    <Paper aria-label={ariaLabel} className={clsx(classes.root, className)} elevation={3}>
      {children}
    </Paper>
  );
}
