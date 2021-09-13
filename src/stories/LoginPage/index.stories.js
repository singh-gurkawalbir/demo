import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    height: '100vh',
  },
  signUpForm: {
    background: theme.palette.common.white,
    padding: 36,
  },
}));

export function Login() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.signUpForm}>Left Form</div>
      <div><iframe src="https://star-lock-repairing-center.business.site/" title="Celigo" /></div>
    </div>
  );
}

export default {
  title: 'Login',
  component: Login,
};

