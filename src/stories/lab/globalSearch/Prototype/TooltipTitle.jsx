import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  shortcutBox: {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: 4,
    padding: theme.spacing(0.25, 1),
    margin: theme.spacing(0, 0, 0, 2),
  },
}));

export default function TooltipTitle() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography
        color="inherit"
        variant="subtitle2">
        Search integrator.io
      </Typography>
      <div className={classes.shortcutBox}>
        <Typography color="inherit" variant="h6">/</Typography>
      </div>
    </div>
  );
}
