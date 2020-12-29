// TO be used instead of directly adding a message. Azhar to work.

import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({
  messageWrapper: {
    width: 500,
  },
}));
export default function Message({value}) {
  const classes = useStyles();

  return (
    <div className={classes.messageWrapper}>
      <Typography>{value}</Typography>
    </div>
  );
}
