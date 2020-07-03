import {invert} from 'lodash';
import csvOptions from '../../../../../components/AFE/SuiteScript/CsvConfigEditor/options';

export default {
  'import.file.csv.columnDelimiter': {
    type: 'select',
    label: 'Column delimiter',
    options: [{items: csvOptions.ColumnDelimiterOptions}],
    value: r => invert(csvOptions.ColumnDelimiterMap)[r?.import?.file?.csv?.columnDelimiter],
    required: true,
  },
  'import.file.csv.includeHeader': {
    type: 'checkbox',
    label: 'Include header',
  },
};
