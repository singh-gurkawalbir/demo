const requestBody = editor =>
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

  ({
    rules: {
      columnDelimiter: editor.columnDelimiter,
      hasHeaderRow: editor.hasHeaderRow,
      keyColumns: editor.multipleRowsPerRecord && editor.keyColumns,
      rowsToSkip: editor.rowsToSkip,
      trimSpaces: editor.trimSpaces,
    },
    data: editor.data,
  });
const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});

export default {
  validate,
  requestBody,
};
