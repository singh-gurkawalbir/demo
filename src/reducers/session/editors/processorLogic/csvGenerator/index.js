import util from '../../../../../utils/json';

const processor = 'csvDataGenerator';

const init = ({resource, options, fieldState}) => {
  const {value} = fieldState || {};
  const {resourceId, resourceType} = options;
  const {customHeaderRows = [], ...others} = value || {};
  const opts = {...others, resourceId, resourceType};

  if (resource?.adaptorType === 'HTTPImport') {
    opts.customHeaderRows = customHeaderRows?.join('\n');
  }

  return {
    ...options,
    rule: options.rule || opts,
  };
};

const requestBody = ({rule, data}) => {
  const {
    columnDelimiter,
    rowDelimiter,
    hasHeaderRow,
    trimSpaces,
    includeHeader,
    truncateLastRowDelimiter,
    replaceTabWithSpace,
    replaceNewlineWithSpace,
    wrapWithQuotes,
    customHeaderRows,
  } = rule || {};

  return {
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
  };
};
const validate = editor => ({
  dataError: !editor.data
    ? 'Must provide some sample data.'
    : util.validateJsonString(editor.data),
});

export default {
  processor,
  validate,
  requestBody,
  init,
};
