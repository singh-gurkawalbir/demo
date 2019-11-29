import { sanitize } from 'dompurify';

export default function RawHtml({ html, ...props }) {
  return (
    <div
      {...props}
      // Since we sanitize the html, as long as dompurify is
      // secure, we "should" be fine here.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}
