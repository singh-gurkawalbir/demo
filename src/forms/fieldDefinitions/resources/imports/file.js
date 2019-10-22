export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  'file.type': {
    type: 'select',
    label: 'File Type',
    required: true,
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
  },
  'edix12.format': {
    type: 'filedefinitionselect',
    label: 'EDI X12 Format',
    format: 'edi',
    required: r => !r,
    visibleWhen: [
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
    required: r => !r,
    visibleWhen: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT Format',
    format: 'ediFact',
    required: r => !r,
    visibleWhen: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
    ],
  },
  'file.filedefinition.rules': {
    type: 'filedefinitioneditor',
    label: 'File Definition Rules ',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
      { field: 'file.output', is: ['records'] },
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
    // filter: r => ({ type: r.type }),y
    // excludeFilter: r => ({ _
    //
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV parse options',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.xlsx.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
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
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.skipAggregation': {
    type: 'checkbox',
    label: 'Skip Aggregation',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.fileDefinition.resourcePath': {
    type: 'text',
    label: 'Resource Path',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
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
