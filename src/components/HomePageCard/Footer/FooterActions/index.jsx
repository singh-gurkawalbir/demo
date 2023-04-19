import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
  },
}));

export default function FooterActions({children}) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{children}</div>;
}

