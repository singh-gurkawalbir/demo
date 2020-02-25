export default function trimObj(obj) {
  if ((!Array.isArray(obj) && typeof obj !== 'object') || !obj) return obj;

  return Object.keys(obj).reduce(
    (acc, key) => {
      // Need to refactor this fix later
      if (key === 'columnDelimiter') {
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
