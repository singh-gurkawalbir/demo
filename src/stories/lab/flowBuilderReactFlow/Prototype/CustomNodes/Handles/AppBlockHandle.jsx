/* eslint-disable no-param-reassign */
import React from 'react';
import { Handle } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  offsetHandle: {
    marginTop: -56,
  },
}));

export default props => {
  const classes = useStyles();

  return (
    <Handle className={classes.offsetHandle} {...props} />
  );
};
