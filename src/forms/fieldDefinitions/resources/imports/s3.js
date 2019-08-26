export default {
  's3.region': {
    type: 'select',
    label: 'Region',
    required: true,
    options: [
      {
        items: [
          { label: 'Us-east-1', value: 'us-east-1' },
          { label: 'Us-east-2', value: 'us-east-2' },
          { label: 'Us-west-1', value: 'us-west-1' },
          { label: 'Us-west-2', value: 'us-west-2' },
          { label: 'Ca-central-1', value: 'ca-central-1' },
          { label: 'Ap-south-1', value: 'ap-south-1' },
          { label: 'Ap-northeast-2', value: 'ap-northeast-2' },
          { label: 'Ap-southeast-1', value: 'ap-southeast-1' },
          { label: 'Ap-southeast-2', value: 'ap-southeast-2' },
          { label: 'Ap-northeast-1', value: 'ap-northeast-1' },
          { label: 'Eu-central-1', value: 'eu-central-1' },
          { label: 'Eu-west-1', value: 'eu-west-1' },
          { label: 'Eu-west-2', value: 'eu-west-2' },
          { label: 'Sa-east-1', value: 'sa-east-1' },
          { label: 'Cn-north-1', value: 'cn-north-1' },
        ],
      },
    ],
  },
  's3.bucketName': {
    type: 'text',
    label: 'Bucket Name',
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
  },
  's3.fileType': {
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
  's3.fileKey': {
    type: 'text',
    label: 'File Key',
    required: true,
  },
  's3.sampleFile': {
    type: 'uploadfile',
    label: 'Sample File (that would be imported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 's3.fileType',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  's3.columnDelimiter': {
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
        field: 's3.fileType',
        is: ['csv'],
      },
    ],
    requiredWhen: [
      {
        field: 's3.fileType',
        is: ['csv'],
      },
    ],
  },
  's3.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 's3.fileType',
        is: ['csv', 'xlsx'],
      },
    ],
  },
  's3.parentOption': {
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
  's3.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 's3.parentOption',
        is: ['true'],
      },
    ],
  },
  's3.rowDelimiter': {
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
        field: 's3.fileType',
        is: ['csv'],
      },
    ],
  },
  's3.skipAggregation': {
    type: 'checkbox',
    label: 'Skip Aggregation',
    visibleWhen: [
      {
        field: 's3.fileType',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  's3.compressFiles': {
    type: 'checkbox',
    label: 'Compress Files',
  },
  's3.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [
      {
        items: [{ label: 'gzip', value: 'gzip' }],
      },
    ],
    visibleWhen: [
      {
        field: 's3.compressFiles',
        is: [true],
      },
    ],
  },
  's3.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    visibleWhen: [
      {
        field: 's3.fileType',
        is: ['csv'],
      },
    ],
  },
  's3.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 's3.fileType',
        is: ['csv'],
      },
    ],
  },
  's3.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 's3.fileType',
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
