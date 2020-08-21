import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  message: {
    overflow: 'auto',
    maxHeight: 100,
  },
}));

export default function ErrorMessage({ message }) {
  const classes = useStyles();

  return <div className={classes.message}>{message}</div>;
}
