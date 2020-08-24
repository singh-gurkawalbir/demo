import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  message: {
    wordBreak: 'break-word',
  },
}));

export default function ErrorMessage({ message }) {
  const classes = useStyles();

  return <div className={classes.message} >{message}</div>;
}
