import isEqual from 'lodash/isEqual';
import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';
import util from '../../../../utils/json';

const requestBody = editor => {
  const rules = {
    columnDelimiter: csvOptions.ColumnDelimiterMap[editor.columnDelimiter],
    rowDelimiter: csvOptions.RowDelimiterMap[editor.rowDelimiter],
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

  // replacing column Delimiter with column delimiter map key. Ex: ',' replaced with 'comma'
  if (rule.columnDelimiter) {
    const columnDelimiter = util.getObjectKeyFromValue(
      csvOptions.ColumnDelimiterMap,
      rule.columnDelimiter
    );

    rule.columnDelimiter = columnDelimiter;
  }

  // replacing row Delimiter with row delimiter map key. Ex: '\n' replaced with 'lf'
  if (rule.rowDelimiter) {
    const rowDelimiter = util.getObjectKeyFromValue(
      csvOptions.RowDelimiterMap,
      rule.rowDelimiter
    );

    rule.rowDelimiter = rowDelimiter;
  }

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
