import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../../../RawHtml';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
    wordBreak: 'break-word',
    maxWidth: 238,
  },
  message: {
    height: '100%',
    overflow: 'hidden',
  },
  htmlMessage: {
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },

}));

export default function TextOverflowCell({ message, containsHtml, style}) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper} style={style}>
      <div className={classes.message}>
        {containsHtml ? <RawHtml html={message} className={classes.htmlMessage} /> : message}
      </div>
    </div>
  );
}
