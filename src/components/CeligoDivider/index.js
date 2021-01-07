import clsx from 'clsx';
import React from 'react';
import { makeStyles, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(0.5, 1, 0),
    height: 24,
    width: 1,
  },
  right: {
    marginLeft: theme.spacing(0),
  },
  left: {
    marginRight: theme.spacing(0),
  },
}));

export default function CeligoDivider({ orientation = 'vertical', position }) {
  const classes = useStyles();

  return (
    <Divider
      orientation={orientation}
      className={clsx(classes.divider, classes[position])}
  />
  );
}
