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
  'file.fileName': {
    type: 'ftpfilenamewitheditor',
    editorTitle: 'Build file name',
    label: r => r?.adaptorType === 'S3Import' ? 'Build file key' : 'Build file name',
    helpText: r => {
      if (r?.adaptorType === 'S3Import') {
        return 'Name of the file.';
      }

      return `Use this field to specify how the files being uploaded to the ${r?.adaptorType === 'FTPImport' ? 'ftp' : 'google drive'} site should be named.  You can type '{{{' to include a predefined timestamp template in your file name.  For example, 'FileXYZ-{{{timestamp "YY-MM-DD" "America/Los_Angeles"}}}.txt' will upload files with the following pattern: 'FileXYZ-16-06-30.txt' in America/Los_Angeles time.  Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.`;
    },
    required: true,
    showAllSuggestions: true,
    refreshOptionsOnChangesTo: ['file.type'],
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
    options: [{ items: [{ label: 'gzip', value: 'gzip' }, { label: 'zip', value: 'zip' }] }],
  },
  'file.backupPath': {
    type: 'uri',
    label: r => r?.adaptorType === 'S3Import' ? 'Backup bucket name' : 'Backup files path',
    helpText: r => {
      if (r?.adaptorType === 'S3Import') {
        return 'Specify the bucket name where files will be backed up after successful transfer.';
      } if (r?.adaptorType === 'FTPImport') {
        return 'Specify the directory path of the FTP folder where files will be backed up after successful transfer.';
      }

      return 'Specify the directory path of the Google Drive folder where files will be backed up after successful transfer.';
    },
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
  'file.encoding': {
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
