export default function TextArea({ fieldMeta, onClick, value, isMapped }) {
  const fieldLength = fieldMeta.details.length;
  let cols = 40;
  let rows = fieldMeta.displayLines || 1;
  let size;

  if (fieldMeta.isAddressField) {
    cols = 27;
    rows = 2;
  }

  if (fieldLength <= 50) {
    size = 20;
  } else if (fieldLength > 255 && !fieldMeta.details.htmlFormatted) {
    cols = 75;
  }

  return size ? (
    <input
      name={fieldMeta.details.name}
      size={size}
      onClick={onClick}
      value={value}
      className={isMapped ? 'celigoAutoMatched' : ''}
    />
  ) : (
    <textarea
      name={fieldMeta.details.name}
      cols={cols}
      rows={rows}
      onClick={onClick}
      value={value}
      className={isMapped ? 'celigoAutoMatched' : ''}
    />
  );
}
