import React from 'react';
import { Handle } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import { handleOffset } from '../../lib';

const useStyles = makeStyles(() => ({
  offsetHandle: {
    marginTop: -handleOffset,
  },
}));

export default props => {
  const classes = useStyles();

  return (
    <Handle className={classes.offsetHandle} {...props} />
  );
};
