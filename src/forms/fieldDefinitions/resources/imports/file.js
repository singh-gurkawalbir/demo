import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  'file.type': {
    type: 'filetypeselect',
    label: 'File type',
    required: true,
    defaultValue: r => r && r.file && r.file.type,
    options: [
      {
        items: [
          { label: 'CSV (or any delimited text file)', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'XLSX', value: 'xlsx' },
          { label: 'XML', value: 'xml' },
          { label: 'EDIX12', value: 'filedefinition' },
          { label: 'Fixed Width', value: 'fixed' },
          { label: 'EDIFACT', value: 'delimited/edifact' },
        ],
      },
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'edix12.format': {
    type: 'filedefinitionselect',
    label: 'EDI x12 format',
    format: 'edi',
    required: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
    ],
  },
  'fixed.format': {
    type: 'filedefinitionselect',
    label: 'Format',
    format: 'fixed',
    required: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT format',
    format: 'ediFact',
    required: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
    ],
  },
  'file.filedefinition.rules': {
    type: 'filedefinitioneditor',
    label: 'File generator helper',
    helpkey: 'import.file.filedefinition.rules',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    refreshOptionsOnChangesTo: [
      'edix12.format',
      'fixed.format',
      'edifact.format',
      'file.fileDefinition.resourcePath',
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
    sampleData: r => r && r.sampleData,
  },
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample file (that would be imported)',
    mode: r => r && r.file && r.file.type,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'file.csvHelper': {
    type: 'csvgenerate',
    label: 'CSV generator helper:',
    helpKey: 'file.csvGenerate',
    refreshOptionsOnChangesTo: [
      'file.csv.includeHeader',
      'file.csv.columnDelimiter',
      'file.csv.rowDelimiter',
      'file.csv.replaceNewlineWithSpace',
      'file.csv.replaceTabWithSpace',
      'file.csv.truncateLastRowDelimiter',
      'file.csv.wrapWithQuotes',
    ],
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.includeHeader': {
    type: 'checkbox',
    label: 'Include header',
    defaultValue: r =>
      (r.file && r.file.csv && r.file.csv.includeHeader) || true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.columnDelimiter': {
    type: 'selectwithinput',
    label: 'Column delimiter',
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.columnDelimiter) || ',',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    options: csvOptions.ColumnDelimiterOptions,
  },
  'file.csv.rowDelimiter': {
    type: 'select',
    label: 'Row delimiter',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
    options: [
      {
        items: csvOptions.RowDelimiterOptions,
      },
    ],
    defaultValue: r =>
      (r && r.file && r.file.csv && r.file.csv.rowDelimiter) || '\n',
  },
  'file.csv.replaceNewlineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    defaultValue: r =>
      (r.file && r.file.csv && r.file.csv.replaceNewlineWithSpace) || false,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    defaultValue: r =>
      (r.file && r.file.csv && r.file.csv.replaceTabWithSpace) || false,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.truncateLastRowDelimiter': {
    type: 'checkbox',
    label: 'Truncate last row delimiter',
    defaultValue: r =>
      (r.file && r.file.csv && r.file.csv.truncateLastRowDelimiter) || false,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    defaultValue: r =>
      (r.file && r.file.csv && r.file.csv.wrapWithQuotes) || false,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.xlsx.includeHeader': {
    type: 'checkbox',
    label: 'Include header',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.skipAggregation': {
    type: 'checkbox',
    label: 'Skip aggregation',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',
    label: 'File file definition _file definition id',
  },
};
