const requestBody = editor => {
  const rules = {
    columnDelimiter: editor.columnDelimiter,
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
  };
};
// commenting it due to complexity of converting value to map label during editor init and getting map value again during save. To be checked later
// TODO Aditya (review )
// const rowDelimiterMap = {
//   cr: '\r',
//   lf: '\n',
//   crlf: '\r\n',
// };
// const columnDelimiterMap = {
//   ',': ',',
//   '|': '|',
//   '': ';',
//   // space
//   ' ': ' ',
//   // Tab
//   '\t': '\t',
// };

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});

export default {
  validate,
  requestBody,
};
