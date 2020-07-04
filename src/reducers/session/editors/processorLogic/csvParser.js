
const requestBody = editor => {
  const rules = {
    columnDelimiter: editor.columnDelimiter,
    rowDelimiter: editor.rowDelimiter,
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

const init = editor => {
  const { rule = {}, ...others } = editor;

  rule.multipleRowsPerRecord = !!(rule.keyColumns && rule.keyColumns.length);
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
