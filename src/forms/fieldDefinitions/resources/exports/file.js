import { isNewId } from '../../../../utils/resource';

export default {
  // TODO: why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample file (that would be parsed)',
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
    ],
  },
  'file.batchSize': {
    loggable: true,
    type: 'text',
    label: 'Batch size',
    validWhen: {
      matchesRegEx: {
        pattern: '^[\\d]+$',
        message: 'Only numbers allowed',
      },
    },
  },
  'file.fileNameStartsWith': {
    loggable: true,
    type: 'uri',
    label: 'File name starts with',
    showExtract: false,
    showLookup: false,
    defaultValue: r => {
      if (r?.file?.filter?.rules) {
        if (r.file.filter.rules[0] === 'and') {
          return r.file.filter.rules[1][2];
        } if (r.file.filter.rules[0] === 'startswith') {
          return r.file.filter.rules[2];
        }
      }
    },
    helpKey: r => {
      if (r.assistant === 'azurestorageaccount') {
        return 'export.azure.fileNameStartsWith';
      }

      return 'export.file.fileNameStartsWith';
    },
  },
  'file.fileNameEndsWith': {
    loggable: true,
    type: 'uri',
    label: 'File name ends with',
    showExtract: false,
    showLookup: false,
    defaultValue: r => {
      if (r?.file?.filter?.rules) {
        if (r.file.filter.rules[0] === 'and') {
          return r.file.filter.rules[2][2];
        } if (r.file.filter.rules[0] === 'endswith') {
          return r.file.filter.rules[2];
        }
      }
    },
    helpKey: r => {
      if (r?.assistant === 'azurestorageaccount') {
        return 'export.azure.fileNameEndsWith';
      }

      return 'export.file.fileNameEndsWith';
    },
  },
  'file.backupPath': {
    loggable: true,
    type: 'uri',
    label: r => r?.adaptorType === 'S3Export' ? 'Backup bucket name' : 'Backup files path',
    helpKey: r => {
      if (r?.adaptorType === 'S3Export') {
        return 'import.s3.backupBucket';
      } if (r?.adaptorType === 'FTPExport') {
        return 'export.ftp.backupDirectoryPath';
      }
      if (r?.assistant === 'azurestorageaccount') {
        return 'export.azure.backupPath';
      }

      return 'export.file.backupPath';
    },
    showLookup: false,
    visibleWhenAll: [
      {
        field: 'fileMetadata',
        isNot: [true],
      },
    ],
  },
  'file.encoding': {
    loggable: true,
    type: 'select',
    label: 'File encoding',
    visibleWhenAll: [
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
    loggable: true,
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
          { label: 'EDI X12', value: 'filedefinition' },
          { label: 'Fixed Width', value: 'fixed' },
          { label: 'EDIFACT', value: 'delimited/edifact' },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'file.skipDelete': {
    loggable: true,
    type: 'checkbox',
    label: 'Leave file on server',
    defaultValue: r => (r && r.file && r.file.skipDelete) || false,
    helpKey: r => r?.assistant === 'azurestorageaccount' ? 'export.azure.skipDelete' : 'export.file.skipDelete',
  },
  'file.compressionFormat': {
    loggable: true,
    type: 'select',
    label: 'Compression format',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.sortByFields': {
    loggable: true,
    type: 'sortandgroup',
    enableSorting: true,
    keyName: 'field',
    valueName: 'descending',
    valueType: 'keyvalue',
    showDelete: true,
    sampleData: r => r && r.sampleData,
    defaultValue: r => (r.file?.sortByFields) || '',
    label: 'Sort records by fields',
  },
  'file.groupByFields': {
    loggable: true,
    type: 'sortandgroup',
    label: 'Group records by fields',
    defaultValue: r => r.file?.groupByFields || r.file?.csv?.keyColumns || r.file?.xlsx?.keyColumns,
  },
  pgpdecrypt: {
    type: 'fileencryptdecrypt',
    label: 'Decrypt files',
    connectionId: r => r && r._connectionId,
    defaultValue: r => !!(r?.file?.decrypt),
  },
  'file.decrypt': {
    type: 'select',
    label: 'Decryption algorithm',
    resourceType: 'exports',
    defaultValue: 'pgp',
    connectionId: r => r && r._connectionId,
    options: [{ items: [{ label: 'pgp', value: 'pgp' }] }],
    omitWhenHidden: true,
    visibleWhen: [{ field: 'pgpdecrypt', is: [true] }],
    requiredWhen: [{ field: 'pgpdecrypt', is: [true] }],
  },
  'file.purgeInternalBackup': {
    loggable: true,
    type: 'checkbox',
    label: 'File purge internal backup',
  },
  'file.json.resourcePath': {
    loggable: true,
    label: 'Resource path',
    type: 'jsonresourcepath',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['json'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'file.xml.resourcePath': {
    loggable: true,
    label: 'Resource path',
    type: 'text',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xml'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    required: true,
  },
  'file.fileDefinition.resourcePath': {
    loggable: true,
    label: 'Resource path',
    type: 'text',
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
  },
  'edix12.format': {
    loggable: true,
    type: 'filedefinitionselect',
    label: 'EDI x12 format',
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
    loggable: true,
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
    loggable: true,
    type: 'filedefinitionselect',
    label: 'EDIFACT format',
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
    loggable: true,
    type: 'filedefinitioneditor',
    label: 'File parser helper',
    helpKey: 'export.file.filedefinition.rules',
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
    fileDefinitionResourcePath: r => r?.file?.fileDefinition?.resourcePath,
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
    sampleData: r => r && r.sampleData,
  },
  'file.csv': {
    loggable: true,
    type: 'csvparse',
    label: 'CSV parser helper',
    helpKey: 'file.csvParse',
    defaultValue: r => r?.file?.csv || {
      columnDelimiter: ',',
      rowDelimiter: '\n',
      hasHeaderRow: false,
      groupByFields: [],
      sortByFields: [],
      rowsToSkip: 0,
      trimSpaces: true,
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
    ],
  },
  'file.xlsx.hasHeaderRow': {
    loggable: true,
    type: 'checkbox',
    label: 'File has header',
    defaultValue: r =>
      !!(r && r.file && r.file.xlsx && r.file.xlsx.hasHeaderRow),
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'file.xlsx.rowsPerRecord': {
    loggable: true,
    type: 'checkboxforresetfields',
    label: 'Multiple rows per record',
    showDeprecatedMessage: true,
    helpKey: 'export.file.rowsPerRecord',
    defaultDisabled: true,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    fieldsToReset: [{ id: 'file.xlsx.keyColumns', value: [] }],
    defaultValue: r => !!(r && r.file && r.file.xlsx && r.file.xlsx.keyColumns),
  },
  'file.xlsx.keyColumns': {
    loggable: true,
    type: 'filekeycolumn',
    defaultDisabled: true,
    label: 'Key columns',
    hasHeaderRow: r =>
      !!(r && r.file && r.file.xlsx && r.file.xlsx.hasHeaderRow),
    refreshOptionsOnChangesTo: ['file.xlsx.hasHeaderRow', 'file.type'],
    sampleData: r => r && r.sampleData,
    visibleWhenAll: [
      {
        field: 'file.xlsx.rowsPerRecord',
        is: [true],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
};
