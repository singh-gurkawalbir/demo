import { isNewId } from '../../../../utils/resource';

export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    mode: r => r && r.file && r.file.type,
    required: r => isNewId(r && r._id),
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'file.output',
        is: ['records'],
      },
    ],
  },
  'file.encoding': {
    type: 'select',
    label: 'File encoding',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'file.output',
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
    type: 'filetypeselect',
    label: 'File type',
    required: true,
    defaultValue: r => (r && r.file && r.file.type) || 'csv',
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
    visibleWhen: [
      {
        field: 'file.output',
        is: ['records'],
      },
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'file.output': {
    type: 'select',
    label: 'Output Mode',
    defaultValue: r => (r && r.file && r.file.output) || 'records',
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
    required: true,
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
    required: true,
    format: 'edi',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'fixed.format': {
    type: 'filedefinitionselect',
    label: 'Format',
    required: true,
    format: 'fixed',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'edifact.format': {
    type: 'filedefinitionselect',
    label: 'EDIFACT Format',
    required: true,
    format: 'ediFact',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
      {
        field: 'outputMode',
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
        field: 'outputMode',
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
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV Parse Options',
    defaultValue: r =>
      (r.file && r.file.csv) || {
        rowsToSkip: 0,
        trimSpaces: true,
        columnDelimiter: ',',
        hasHeaderRow: false,
        rowDelimiter: '\n',
      },
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'file.output',
        is: ['records'],
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
    defaultValue: r => !!(r && r.file && r.file.xlsx && r.file.xlsx.keyColumns),
  },
  'file.xlsx.keyColumns': {
    type: 'filekeycolumn',
    label: 'Key Columns',
    sampleData: r => r && r.sampleData,
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
