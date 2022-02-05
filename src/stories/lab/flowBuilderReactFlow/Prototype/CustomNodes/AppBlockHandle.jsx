/* eslint-disable no-param-reassign */
import React from 'react';
import { Handle } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  handle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
    marginTop: -56,
  },
}));

export default props => {
  const classes = useStyles();

  return (
    <Handle className={classes.handle} {...props} />
  );
};
