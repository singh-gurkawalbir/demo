import csvOptions from '../../../../../components/AFE/CsvConfigEditor/options';

export default {
  uploadFile: {
    type: 'suitescriptuploadfile',
    placeholder: 'Sample file (that would be parsed)',
    mode: 'csv',
    required: true,
  },
  'export.file.csvHelper': {
    type: 'suitescriptcsvparse',
    label: 'CSV parser helper:',
    helpKey: 'file.csvParse',
    refreshOptionsOnChangesTo: [
      'export.file.csv.keyColumns',
      'export.file.csv.columnDelimiter',
      'export.file.csv.rowDelimiter',
      'export.file.csv.hasHeaderRow',
    ],
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
  },
  'export.file.csv.columnDelimiter': {
    id: 'export.file.csv.columnDelimiter',
    type: 'selectwithinput',
    label: 'Column delimiter',
    options: csvOptions.ColumnDelimiterOptions,
    defaultValue: r => r?.export?.file?.csv?.columnDelimiter || ',',
  },
  'export.file.csv.rowDelimiter': {
    id: 'export.file.csv.rowDelimiter',
    type: 'select',
    label: 'Row delimiter',
    options: [
      {
        items: csvOptions.RowDelimiterOptions,
      },
    ],
    defaultValue: r => r?.export?.file?.csv?.rowDelimiter || '\n',
  },
  'export.file.csv.hasHeaderRow': {
    id: 'export.file.csv.hasHeaderRow',
    type: 'csvhasheaderrow',
    fieldToReset: 'export.file.csv.keyColumns',
    fieldResetValue: [],
    label: 'File has header',
    defaultValue: r => !!r?.export?.file?.csv?.hasHeaderRow,
  },
  'export.file.csv.rowsPerRecord': {
    id: 'export.file.csv.rowsPerRecord',
    type: 'checkbox',
    label: 'Multiple rows per record',
    defaultValue: r => !!r?.export?.file?.csv?.keyColumns,
  },
  'export.file.csv.keyColumns': {
    id: 'export.file.csv.keyColumns',
    type: 'filekeycolumn',
    label: 'Key columns',
    refreshOptionsOnChangesTo: [
      'export.file.csv.hasHeaderRow',
      'export.file.csv.columnDelimiter',
      'export.file.csv.rowDelimiter',
      'export.file.csv.rowsPerRecord',
    ],
    sampleData: r => r?.export?.sampleData,
    visibleWhenAll: [
      {
        field: 'export.file.csv.rowsPerRecord',
        is: [true],
      },
    ],
    defaultValue: r => r?.export?.file?.csv?.keyColumns || [],
  },
};
