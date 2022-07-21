import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import getDomPurify from '../../utils/domPurify';
import { ALLOWED_HTML_TAGS } from '../../constants';
import isLoggableAttr from '../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  rawHtmlWrapper: {
    '& > p': {
      margin: theme.spacing(1, 0),
    },
  },
}));

export default function RawHtml({ html, options = {}, isLoggable, ...props }) {
  const classes = useStyles();
  const sanitizedHtml = useMemo(() => {
    const { sanitize } = getDomPurify(options);

    return sanitize(html, {
      ALLOWED_TAGS: options.allowedTags || ALLOWED_HTML_TAGS,
    });
  }, [html, options]);

  return (
    <div
      className={classes.rawHtmlWrapper}
      {...props}
      {...isLoggableAttr(isLoggable)}
      // Since we sanitize the html, as long as dompurify is
      // secure, we "should" be fine here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
