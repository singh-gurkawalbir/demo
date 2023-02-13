import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  loginFormWrapper: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));
export default function LoginFormWrapper({className}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.loginFormWrapper, className)} />
  );
}
