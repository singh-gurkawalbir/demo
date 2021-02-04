import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../RawHtml';

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
    wordBreak: 'break-word',
    maxWidth: maxWidth => `${maxWidth}px`,
  },
  message: {
    height: '100%',
    overflow: 'hidden',
    lineHeight: '24px',
  },
  htmlMessage: {
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },

});

export default function TextOverflowCell({ message, containsHtml, style, maxWidth}) {
  const classes = useStyles(maxWidth);

  return (
    <div className={classes.wrapper} style={style}>
      <div className={classes.message}>
        {containsHtml ? <RawHtml html={message} className={classes.htmlMessage} /> : message}
      </div>
    </div>
  );
}
