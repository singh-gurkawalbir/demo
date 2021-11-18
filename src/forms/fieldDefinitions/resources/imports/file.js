export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
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
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'file.fileName': {
    loggable: true,
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
              pattern: '{{timestamp "(?=.*x).*"}}|{{timestamp "(?=.*X).*"}}|{{timestamp "(?=.*mm)(?=.*ss).*"}}',
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'filedefinitioneditor',
    label: 'File generator helper',
    helpKey: 'import.file.filedefinition.rules',
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
    label: 'Sample file (that would be generated)',
    mode: r => r && r.file && r.file.type,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'file.csv': {
    loggable: true,
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
    ],
  },
  'file.xlsx.includeHeader': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    defaultValue: r => {
      console.log('resource: ', r);

      return r?.file?.batchSize || '';
    },
    helpKey: 'import.file.batchSize',
    validWhen: {
      matchesRegEx: {
        pattern: '^[\\d]+$',
        message: 'Only numbers allowed',
      },
    },
  },
  'file.backupPath': {
    loggable: true,
    type: 'uri',
    label: r => r?.adaptorType === 'S3Import' ? 'Backup bucket name' : 'Backup files path',
    helpKey: r => {
      if (r?.adaptorType === 'S3Import') {
        return 'import.s3.backupBucket';
      } if (r?.adaptorType === 'FTPImport') {
        return 'import.ftp.backupDirectoryPath';
      } if (r?.assistant === 'azurestorageaccount') {
        return 'import.azure.backupPath';
      }

      return 'import.file.backupPath';
    },
    showLookup: false,
  },
  'file.skipAggregation': {
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: 'File file definition _file definition id',
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
};
