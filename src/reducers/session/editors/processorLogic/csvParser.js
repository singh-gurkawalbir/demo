const requestBody = editor => {
  const rowDelimiterMap = {
    '': undefined,
    cr: '\r',
    lf: '\n',
    crlf: '\r\n',
  };
  const columnDelimiterMap = {
    '': undefined,
    ',': ',',
    '|': '|',
    tab: '\t',
  };

  return {
    rules: {
      columnDelimiter: columnDelimiterMap[editor.columnDelimiter],
      rowDelimiter: rowDelimiterMap[editor.rowDelimiter],
      keyColumns: editor.keyColumns,
      hasHeaderRow: editor.hasHeaderRow,
      trimSpaces: editor.trimSpaces,
    },
    data: editor.data,
  };
};

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});

export default {
  validate,
  requestBody,
};
