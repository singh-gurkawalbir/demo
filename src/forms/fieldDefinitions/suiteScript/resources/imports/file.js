import csvOptions from '../../../../../components/AFE/Editor/panels/CsvParseRules/suitescript/options';

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
};
