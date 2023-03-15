import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  wrapper: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
});

export default function Content({children}) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{children}</div>;
}

