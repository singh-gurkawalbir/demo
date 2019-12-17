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

export default {
  validate,
  requestBody,
};
