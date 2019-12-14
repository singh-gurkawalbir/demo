import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

const requestBody = editor => {
  const rules = {
    columnDelimiter: csvOptions.ColumnDelimiterMap[editor.columnDelimiter],
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

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});

export default {
  validate,
  requestBody,
};
