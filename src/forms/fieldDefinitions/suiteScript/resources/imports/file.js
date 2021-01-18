import csvOptions from '../../../../../components/AFE/SuiteScript/CsvConfigEditor/options';

export default {
  'import.file.csv.columnDelimiter': {
    id: 'import.file.csv.columnDelimiter',
    type: 'selectwithinput',
    label: 'Column delimiter',
    options: csvOptions.ColumnDelimiterOptions,
    defaultValue: r => r?.import?.file?.csv?.columnDelimiter || ',',
  },
  'import.file.csv.includeHeader': {
    type: 'checkbox',
    label: 'Include header',
  },
  'import.file.fileName': {
    type: 'text',
    label: 'File name',
  },
};
