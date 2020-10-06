import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
  },
  message: {
    height: '100%',
    overflow: 'hidden',
  },

}));

export default function OverflowWrapper({ message }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.message}>
        {message}
      </div>
    </div>
  );
}
