export const MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK = 300;
export const MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK = 10;

const minimumLengthByType = {
  string: MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK,
  object: MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK,
};

const realLength = s => {
  if (!s) return 0;

  return typeof s === 'object'
    ? JSON.stringify(s).length
    : s.length;
};

export function hasLongLength(oldValue, newValue) {
  return (
    realLength(oldValue) > minimumLengthByType[typeof oldValue] ||
    realLength(newValue) > minimumLengthByType[typeof newValue]
  );
}
