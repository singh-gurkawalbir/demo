import getDomPurify from '../../utils/domPurify';

export default function RawHtml({ html, options = {}, ...props }) {
  const { sanitize } = getDomPurify(options);
  const sanitizedHtml = options.allowedTags
    ? sanitize(html, {
        ALLOWED_TAGS: options.allowedTags,
      })
    : sanitize(html);

  return (
    <div
      {...props}
      // Since we sanitize the html, as long as dompurify is
      // secure, we "should" be fine here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
