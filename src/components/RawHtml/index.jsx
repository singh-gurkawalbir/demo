import React, { useMemo } from 'react';
import getDomPurify from '../../utils/domPurify';
import { ALLOWED_HTML_TAGS } from '../../constants';
import isLoggableAttr from '../../utils/isLoggableAttr';

export default function RawHtml({ html, options = {}, isLoggable, ...props }) {
  const sanitizedHtml = useMemo(() => {
    const { sanitize } = getDomPurify(options);

    return sanitize(html, {
      ALLOWED_TAGS: options.allowedTags || ALLOWED_HTML_TAGS,
    });
  }, [html, options]);

  return (
    <div
      {...props}
      {...isLoggableAttr(isLoggable)}
      // Since we sanitize the html, as long as dompurify is
      // secure, we "should" be fine here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
