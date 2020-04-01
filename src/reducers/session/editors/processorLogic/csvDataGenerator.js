import util from '../../../../utils/json';
import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

const requestBody = editor => ({
  rules: {
    columnDelimiter: csvOptions.ColumnDelimiterMap[editor.columnDelimiter],
    rowDelimiter: csvOptions.RowDelimiterMap[editor.rowDelimiter],
    hasHeaderRow: editor.hasHeaderRow,
    trimSpaces: editor.trimSpaces,
    includeHeader: editor.includeHeader,
    truncateLastRowDelimiter: editor.truncateLastRowDelimiter,
    replaceTabWithSpace: editor.replaceTabWithSpace,
    replaceNewlineWithSpace: editor.replaceNewlineWithSpace,
    wrapWithQuotes: editor.wrapWithQuotes,
  },
  data: [JSON.parse(editor.data)],
});
const validate = editor => ({
  dataError: util.validateJsonString(editor.data),
});
const dirty = editor => {
  const { initRule } = editor || {};
  const keysToMatch = [
    'rowDelimiter',
    'columnDelimiter',
    'includeHeader',
    'truncateLastRowDelimiter',
    'replaceTabWithSpace',
    'replaceNewlineWithSpace',
    'wrapWithQuotes',
  ];

  for (let i = 0; i < keysToMatch.length; i += 1) {
    const key = keysToMatch[i];

    if (typeof editor[key] === 'boolean' && !!initRule[key] !== !!editor[key]) {
      return true;
    } else if (
      ['string', 'number'].includes(typeof editor[key]) &&
      initRule[key] !== editor[key]
    )
      return true;
  }

  return false;
};

const init = editor => {
  const { rule = {}, ...others } = editor;

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
