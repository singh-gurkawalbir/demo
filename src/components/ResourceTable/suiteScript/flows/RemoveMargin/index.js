import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  root: {
    margin: '-16px 0',
  },
}));

export default function RemoveMargin({children}) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}
