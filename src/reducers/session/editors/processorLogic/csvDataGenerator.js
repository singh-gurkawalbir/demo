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
  dataError: !editor.data
    ? 'Must provide some sample data.'
    : util.validateJsonString(editor.data),
});

const init = editor => {
  const { rule = {}, ...others } = editor;
  const initRules = {};
  Object.keys(rule).forEach(key => {
    initRules[`_init_${key}`] = rule[key];
  });
  return {
    ...others,
    ...rule,
    ...initRules
  };
};

export default {
  validate,
  requestBody,
  init,
};
