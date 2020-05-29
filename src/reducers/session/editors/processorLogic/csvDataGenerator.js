import util from '../../../../utils/json';

const requestBody = editor => ({
  rules: {
    columnDelimiter: editor.columnDelimiter,
    rowDelimiter: editor.rowDelimiter,
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
