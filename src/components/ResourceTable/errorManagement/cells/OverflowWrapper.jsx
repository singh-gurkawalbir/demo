import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../../../RawHtml';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
    wordBreak: 'break-word',
  },
  message: {
    height: '100%',
    overflow: 'hidden',
  },

}));

export default function OverflowWrapper({ message, containsHtml }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.message}>
        {containsHtml ? <RawHtml html={message} /> : message}
      </div>
    </div>
  );
}
