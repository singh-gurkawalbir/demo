import util from '../../../../utils/json';

const requestBody = editor => ({
  rules: {
    columnDelimiter: editor.columnDelimiter,
    rowDelimiter: editor.rowDelimiter,
    keyColumns: editor.multipleRowsPerRecord && editor.keyColumns,
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
