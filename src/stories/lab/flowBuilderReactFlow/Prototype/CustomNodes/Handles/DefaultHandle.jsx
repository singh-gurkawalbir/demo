/* eslint-disable no-param-reassign */
import clsx from 'clsx';
import React from 'react';
import { Handle } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  defaultHandle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
}));

export default ({className, ...props}) => {
  const classes = useStyles();

  return (
    <Handle className={clsx(classes.defaultHandle, className)} {...props} />
  );
};
