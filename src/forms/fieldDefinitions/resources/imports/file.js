export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  'file.type': {
    isLoggable: true,
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
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'file.fileName': {
    isLoggable: true,
    type: 'ftpfilenamewitheditor',
    label: r => r?.adaptorType === 'S3Import' ? 'File key' : 'File name',
    helpKey: r => {
      if (r?.adaptorType === 'S3Import') {
        return 'import.s3.fileKey';
      }
      if (r?.adaptorType === 'FTPImport') {
        return 'import.ftp.fileName';
      }
      if (r?.assistant === 'azurestorageaccount') {
        return 'import.azure.fileName';
      }

      return 'import.file.fileName';
    },
    required: true,
    showAllSuggestions: true,
    validWhen: {
      someAreTrue: {
        message:
          'Please append date and time stamp, such as {{timestamp "YYYY-MM-DD hh:mm:ss" "America/Los_Angeles"}}.',
        conditions: [
          {
            field: 'file.skipAggregation',
            isNot: {
              values: [true],
            },
          },
          {
            matchesRegEx: {
              pattern: '{{timestamp}}|{{timestamp "(?=.*x).*"}}|{{timestamp "(?=.*X).*"}}|{{timestamp "(?=.*mm)(?=.*ss).*"}}',
            },
          },
          {
            matchesRegEx: {
              pattern: '{{uuid}}',
            },
          },
          {
            matchesRegEx: {
              pattern: '{{random\\s+"(uuid|UUID)"\\s*\\d*}}',
            },
          },
        ],
      },
    },
    visibleWhen: r => {
      if (r?.adaptorType === 'FTPImport') {
        return [{
          field: 'inputMode',
          is: ['records'],
        }];
      }

      return [];
    },
  },
  'edix12.format': {
    isLoggable: true,
    type: 'filedefinitionselect',
    label: 'EDI x12 format',
    format: 'edi',
    required: true,
  },
  'fixed.format': {
    isLoggable: true,
    type: 'filedefinitionselect',
    label: 'Format',
    format: 'fixed',
    required: true,
  },
  'edifact.format': {
    isLoggable: true,
    type: 'filedefinitionselect',
    label: 'EDIFACT format',
    format: 'ediFact',
    required: true,
  },
  'file.filedefinition.rules': {
    isLoggable: true,
    type: 'filedefinitioneditor',
    label: 'File generator helper',
    helpKey: 'import.file.filedefinition.rules',
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
    label: 'Sample file (that would be generated)',
    mode: r => r && r.file && r.file.type,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'file.csv': {
    isLoggable: true,
    type: 'csvgenerate',
    label: 'CSV generator helper',
    helpKey: 'file.csvGenerate',
    defaultValue: r => r?.file?.csv || {
      includeHeader: true,
      columnDelimiter: ',',
      rowDelimiter: '\n',
      replaceNewlineWithSpace: false,
      replaceTabWithSpace: false,
      truncateLastRowDelimiter: false,
      wrapWithQuotes: false,
    },
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'file.xlsx.includeHeader': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Include header',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'file.compressionFormat': {
    isLoggable: true,
    type: 'select',
    label: 'Compression format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }, { label: 'zip', value: 'zip' }] }],
  },
  pgpencrypt: {
    type: 'fileencryptdecrypt',
    label: 'Encrypt files',
    defaultValue: r => !!(r?.file?.encrypt),
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'file.encrypt': {
    isLoggable: true,
    type: 'select',
    label: 'Encryption algorithm',
    connectionId: r => r && r._connectionId,
    defaultValue: 'pgp',
    options: [{ items: [{ label: 'pgp', value: 'pgp' }] }],
    omitWhenHidden: true,
    visibleWhen: [{ field: 'pgpencrypt', is: [true] }],
    requiredWhen: [{ field: 'pgpencrypt', is: [true] }],
  },
  'file.pgp.symmetricKeyAlgorithm': {
    isLoggable: true,
    type: 'select',
    label: 'Encryption symmetric key algorithm',
    requiredWhenAll: [
      {
        field: 'file.encrypt',
        isNot: [''],
      },
      { field: 'pgpencrypt', is: [true] },
    ],
    visibleWhenAll: [
      {
        field: 'file.encrypt',
        isNot: [''],
      },
      { field: 'pgpencrypt', is: [true] },
    ],
    defaultValue: r => r?.file?.pgp?.symmetricKeyAlgorithm || 'aes256',
    options: [{ items: [{ label: 'twofish', value: 'twofish' }, { label: 'cast5', value: 'cast5' }, { label: '3des', value: '3des' }, { label: 'aes128', value: 'aes128' }, { label: 'aes192', value: 'aes192' }, { label: 'aes256', value: 'aes256' }] }],
  },
  'file.pgp.hashAlgorithm': {
    isLoggable: true,
    type: 'hashalgorithm',
    label: 'Signing hash algorithm',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      {
        field: 'file.encrypt',
        isNot: [''],
      },
      { field: 'pgpencrypt', is: [true] },
    ],
    options: [{ items: [{ label: 'sha256', value: 'sha256' }, { label: 'sha384', value: 'sha384' }, { label: 'sha512', value: 'sha512' }, { label: 'sha224', value: 'sha224' }] }],
  },
  'file.batchSize': {
    type: 'text',
    label: 'Batch size',
    defaultValue: r => r?.file?.batchSize || '',
    helpKey: 'import.file.batchSize',
    validWhen: {
      matchesRegEx: {
        pattern: '^[\\d]+$',
        message: 'Only numbers allowed',
      },
    },
  },
  'file.backupPath': {
    isLoggable: true,
    type: 'uri',
    label: r => r?.adaptorType === 'S3Import' ? 'Backup bucket name' : 'Backup files path',
    helpKey: r => {
      if (r?.adaptorType === 'S3Import') {
        return 'import.s3.backupBucket';
      } if (r?.adaptorType === 'FTPImport') {
        return 'import.ftp.backupDirectoryPath';
      } if (r?.assistant === 'azurestorageaccount') {
        return 'import.azure.backupPath';
      } if (r?.assistant === 'box') {
        return 'import.box.backupPath';
      } if (r?.assistant === 'dropbox') {
        return 'import.dropbox.backupPath';
      }

      return 'import.file.backupPath';
    },
    showLookup: false,
  },
  'file.skipAggregation': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Skip aggregation',
    defaultValue: r => !!(r && r.file && r.file.skipAggregation),
    disabledWhen: [
      {
        field: 'file.batchSize',
        isNot: ['', 0, 1],
      },
    ],
    refreshOptionsOnChangesTo: ['file.type', 'file.batchSize'],
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.fileDefinition._fileDefinitionId': {
    isLoggable: true,
    type: 'text',
    label: 'File file definition _file definition id',
  },
  'file.encoding': {
    isLoggable: true,
    type: 'select',
    label: 'File encoding',
    refreshOptionsOnChangesTo: 'file.type',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
};
