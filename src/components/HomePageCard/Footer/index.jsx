import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '22px',
    left: '22px',
    right: '22px',
  },
}));

export default function Footer({children}) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{children}</div>;
}

