export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Ftp directory Path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    required: true,
  },
  'ftp.fileType': {
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
  'ftp.fileName': {
    type: 'text',
    label: 'Ftp File Name',
    required: true,
  },
  'ftp.sampleFile': {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'ftp.columnDelimiter': {
    type: 'select',
    label: 'Column Delimiter',
    options: [
      {
        items: [
          { label: 'Comma', value: ',' },
          { label: 'Pipe', value: '|' },
          { label: 'Semicolon', value: ';' },
          { label: 'Space', value: ' ' },
          { label: 'Tab', value: '\t' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  'ftp.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv', 'xlsx'],
      },
    ],
  },
  'ftp.parentOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: 'false',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  'ftp.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'ftp.parentOption',
        is: ['true'],
      },
    ],
  },
  'ftp.rowDelimiter': {
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
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  'ftp.useTempFile': {
    type: 'checkbox',
    label: 'Use temp file while upload in progress',
  },
  'ftp.inProgressFileName': {
    type: 'text',
    label: 'In Progress File Name',
    visibleWhen: [
      {
        field: 'ftp.useTempFile',
        is: [true],
      },
    ],
  },
  'ftp.skipAggregation': {
    type: 'checkbox',
    label: 'Skip Aggregation',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'ftp.compressFiles': {
    type: 'checkbox',
    label: 'Compress Files',
  },
  'ftp.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    placeholder: 'Please select',
    options: [
      {
        items: [{ label: 'gzip', value: 'gzip' }],
      },
    ],
    visibleWhen: [
      {
        field: 'ftp.compressFiles',
        is: [true],
      },
    ],
  },
  'ftp.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  'ftp.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  'ftp.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Aggregate Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Aggregate Stack Id',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
};
