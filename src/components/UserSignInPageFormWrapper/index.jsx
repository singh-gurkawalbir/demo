import React from 'react';
import { makeStyles} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  formWrapper: {
    wordBreak: 'break-word',
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
}));
export default function UserSignInPageFormWraper({className, children}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.formWrapper, className)}>
      {children}
    </div>
  );
}
