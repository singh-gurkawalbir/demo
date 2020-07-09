export default function trimObj(obj) {
  if ((!Array.isArray(obj) && typeof obj !== 'object') || !obj) return obj;

  return Object.keys(obj).reduce(
    (acc, key) => {
      // Need to refactor this fix later

      if (
        [
          'columnDelimiter',
          'rowDelimiter',
          '/file/csv/rowDelimiter',
          '/file/csv/columnDelimiter',
          '/rest/authScheme',
          /** SuiteScript V2 fields */
          '/export/file/csv/rowDelimiter',
          '/export/file/csv/columnDelimiter',
          '/import/file/csv/rowDelimiter',
          '/import/file/csv/columnDelimiter',
        ].includes(key)
      ) {
        acc[key] = typeof obj[key] === 'string' ? obj[key] : trimObj(obj[key]);
      } else {
        acc[key] =
          typeof obj[key] === 'string' ? obj[key].trim() : trimObj(obj[key]);
      }

      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}
