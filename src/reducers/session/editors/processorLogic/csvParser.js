import isEqual from 'lodash/isEqual';

const requestBody = editor => {
  const rules = {
    columnDelimiter: editor.columnDelimiter,
    rowDelimiter: editor.rowDelimiter,
    hasHeaderRow: editor.hasHeaderRow,
    trimSpaces: editor.trimSpaces,
  };

  if (Number.isInteger(editor.rowsToSkip)) {
    rules.rowsToSkip = editor.rowsToSkip;
  }

  if (editor.multipleRowsPerRecord && editor.keyColumns) {
    rules.keyColumns = editor.keyColumns;
  }

  return {
    rules,
    data: editor.data,
    options: { includeEmptyValues: true },
  };
};

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});
const dirty = editor => {
  const { initRule } = editor || {};
  const keysToMatch = [
    'rowDelimiter',
    'columnDelimiter',
    'keyColumns',
    'hasHeaderRow',
    'multipleRowsPerRecord',
    'trimSpaces',
    'rowsToSkip',
  ];

  for (let i = 0; i < keysToMatch.length; i += 1) {
    const key = keysToMatch[i];

    if (typeof editor[key] === 'boolean' && !!initRule[key] !== !!editor[key]) {
      return true;
    } else if (
      Array.isArray(editor[key]) &&
      !isEqual(initRule[key], editor[key])
    )
      return true;
    else if (
      ['string', 'number'].includes(typeof editor[key]) &&
      initRule[key] !== editor[key]
    )
      return true;
  }

  return false;
};

const init = editor => {
  const { rule = {}, ...others } = editor;

  rule.multipleRowsPerRecord = !!(rule.keyColumns && rule.keyColumns.length);

  return {
    ...others,
    ...rule,
    initRule: rule,
  };
};

export default {
  validate,
  requestBody,
  dirty,
  init,
};
