import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

const requestBody = editor => {
  const rules = {
    columnDelimiter: csvOptions.ColumnDelimiterMap[editor.columnDelimiter],
    rowDelimiter: csvOptions.RowDelimiterMap[editor.rowDelimiter],
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
    options: { includeEmptyValues: true },
  };
};

const validate = editor => ({
  dataError:
    (!editor.data || !editor.data.length) && 'Must provide some sample data.',
});
const dirty = editor => {
  const { initRule } = editor || {};
  let isDirty = false;

  Object.keys(initRule).forEach(key => {
    if (initRule[key] !== editor[key]) isDirty = true;
  });

  return isDirty;
};

export default {
  validate,
  requestBody,
  dirty,
};
