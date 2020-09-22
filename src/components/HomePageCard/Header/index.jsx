import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    height: 50,
    display: 'flex',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default function Header({ children }) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{children}</div>;
}
