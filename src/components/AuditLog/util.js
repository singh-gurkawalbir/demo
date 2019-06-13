export const AUDIT_LOG_SOURCE_LABELS = {
  ui: 'UI',
  api: 'API',
  connector: 'Connector',
  stack: 'Stack',
  system: 'System',
};
export const AUDIT_LOG_EVENT_LABELS = {
  create: 'Create',
  delete: 'Delete',
  update: 'Update',
  view: 'View',
};
export const OPTION_ALL = { id: 'all', label: 'All' };

export const MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK = 300;
export const MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK = 10;

export function showViewDiffLink(oldValue, newValue) {
  const oldValueType = typeof oldValue;
  const newValueType = typeof newValue;
  const oldValueLength =
    oldValue &&
    (oldValueType === 'object'
      ? JSON.stringify(oldValue).length
      : oldValue.length);
  const newValueLength =
    newValue &&
    (newValueType === 'object'
      ? JSON.stringify(newValue).length
      : newValue.length);
  const minimumLengthByType = {
    string: MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK,
    object: MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK,
  };

  if (oldValueLength > minimumLengthByType[oldValueType]) {
    return true;
  }

  if (newValueLength > minimumLengthByType[newValueType]) {
    return true;
  }

  return false;
}
