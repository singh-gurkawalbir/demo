import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
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
    fontSize: 16,
  },
  htmlMessage: {
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },

});

export default function TextOverflowCell({ message, containsHtml, rawHtmlOptions, style, maxWidth, className}) {
  const classes = useStyles(maxWidth);

  return (
    <div className={clsx(classes.wrapper, className)} style={style}>
      <div className={classes.message}>
        {containsHtml ? <RawHtml html={message} options={rawHtmlOptions} className={classes.htmlMessage} /> : message}
      </div>
    </div>
  );
}
