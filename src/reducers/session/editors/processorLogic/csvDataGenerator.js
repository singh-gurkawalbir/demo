import util from '../../../../utils/json';

const requestBody = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  trimSpaces,
  includeHeader,
  truncateLastRowDelimiter,
  replaceTabWithSpace,
  replaceNewlineWithSpace,
  wrapWithQuotes,
  data,
  customHeaderRows,
}) => {
  const body = {
    rules: {
      columnDelimiter,
      rowDelimiter,
      hasHeaderRow,
      trimSpaces,
      includeHeader,
      truncateLastRowDelimiter,
      replaceTabWithSpace,
      replaceNewlineWithSpace,
      wrapWithQuotes,

    },
    data: [JSON.parse(data)],
  };

  if (typeof customHeaderRows !== 'undefined') { body.rules.customHeaderRows = customHeaderRows.split('\n').filter(val => val !== ''); }
  return body;
};
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
