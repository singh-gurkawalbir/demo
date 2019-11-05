export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.encoding': {
    type: 'select',
    label: 'File encoding',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'UTF-8', value: 'utf8' },
          { label: 'Windows-1252', value: 'win1252' },
          { label: 'UTF-16LE', value: 'utf-16le' },
        ],
      },
    ],
  },
  'file.type': {
    type: 'select',
    label: 'File type',
    required: true,
    options: [
      {
        items: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'XLSX', value: 'xlsx' },
          { label: 'XML', value: 'xml' },
          { label: 'EDI X12', value: 'filedefinition' },
          { label: 'Fixed Width', value: 'fixed' },
          { label: 'EDIFACT', value: 'delimited/edifact' },
        ],
      },
    ],
  },
  'file.output': {
    type: 'select',
    label: 'Output Mode',
    options: [
      {
        items: [
          { label: 'Records', value: 'records' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'Blob Keys', value: 'blobKeys' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'file.skipDelete': {
    type: 'checkbox',
    label: 'Leave File On Server',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'ftp.leaveFile': {
    type: 'checkbox',
    label: 'Leave File On Server',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
    ],
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.purgeInternalBackup': {
    type: 'checkbox',
    label: 'File purge Internal Backup',
  },
  'file.json.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['json'],
      },
    ],
  },
  'file.xml.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xml'],
      },
    ],
  },
  'file.fileDefinition.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
    ],
  },
  'edix12.format': {
    type: 'filedefinitionselect',
    label: 'EDI X12 Format',
    format: 'edi',
    required: r => !r,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
      { field: 'file.output', is: ['records'] },
    ],
  },
  'fixed.format': {
    type: 'filedefinitionselect',
    label: 'Format',
    format: 'fixed',
    required: r => !r,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
      { field: 'file.output', is: ['records'] },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT Format',
    format: 'ediFact',
    required: r => !r,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
      { field: 'file.output', is: ['records'] },
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
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File Has Header',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.xlsx.rowsPerRecord': {
    type: 'checkbox',
    label: 'Multiple Rows Per Record',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.xlsx.keyColumns': {
    type: 'text',
    label: 'Key Columns',
    visibleWhenAll: [
      {
        field: 'file.xlsx.rowsPerRecord',
        is: [true],
      },
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
};
