export default function RawHtml({ html, ...props }) {
  return (
    <div
      {...props}
      // TODO: We need to run the html through some type of sanitize
      // process. I do not know if we already have something in the
      // old UI to re-use here?
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
