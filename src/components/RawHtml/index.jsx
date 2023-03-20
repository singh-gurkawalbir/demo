import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
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

export default function RawHtml({ html, options = {}, isLoggable, className, ...props }) {
  const classes = useStyles();
  const sanitizedHtml = useMemo(() => {
    const { sanitize } = getDomPurify(options);

    return sanitize(html, {
      ALLOWED_TAGS: options.allowedTags || ALLOWED_HTML_TAGS,
    });
  }, [html, options]);

  return (
    <div
      className={clsx(classes.rawHtmlWrapper, className)}
      {...props}
      {...isLoggableAttr(isLoggable)}
      // Since we sanitize the html, as long as dompurify is
      // secure, we "should" be fine here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
