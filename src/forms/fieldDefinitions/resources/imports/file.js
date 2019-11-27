export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  'file.type': {
    type: 'filetypeselect',
    label: 'File Type',
    required: true,
    defaultValue: r => (r && r.file && r.file.type) || 'csv',
    options: [
      {
        items: [
          { label: 'CSV', value: 'csv' },
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
    label: 'EDI X12 Format',
    format: 'edi',
    required: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
      {
        field: 'inputMode',
        is: ['records'],
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
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT Format',
    format: 'ediFact',
    required: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'file.filedefinition.rules': {
    type: 'filedefinitioneditor',
    label: 'File Definition Rules ',
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
  },
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be imported)',
    mode: r => r && r.file && r.file.type,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV parse options',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.xlsx.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.csv.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
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
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.skipAggregation': {
    type: 'checkbox',
    label: 'Skip Aggregation',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',
    label: 'File file Definition _file Definition Id',
  },
  'file.csv.rowDelimiter': {
    type: 'select',
    label: 'Row Delimiter',
    options: [
      {
        items: [
          { label: 'LF(\\n)', value: '\n' },
          { label: 'CR(\\r)', value: '\r' },
          { label: 'CR(\\r) LF(\\n) ', value: '\r\n' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
};
