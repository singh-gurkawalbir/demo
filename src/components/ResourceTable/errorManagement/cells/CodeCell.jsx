import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    wordBreak: 'break-word',
  },
  message: {
    height: '100%',
    overflow: 'hidden',
    lineHeight: '24px',
    fontSize: 16,
  },
});

export default function CodeCell({ message }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.wrapper)}>
      <div className={classes.message}>
        {message}
      </div>
    </div>
  );
}
