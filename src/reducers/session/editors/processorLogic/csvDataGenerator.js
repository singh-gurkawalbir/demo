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
}) => ({
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
    customHeaderRows: customHeaderRows?.split('\n').filter(val => val !== ''),

  },
  data: [JSON.parse(data)],
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
    ...initRules,
  };
};

export default {
  validate,
  requestBody,
  init,
};
