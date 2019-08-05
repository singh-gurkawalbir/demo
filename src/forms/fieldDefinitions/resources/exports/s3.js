export default {
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['csv', 'xml', 'json', 'xlsx'],
      },
    ],
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },
  'ftp.exportFrom': {
    type: 'labeltitle',
    label: 'Where would you like to export data from?',
  },
  's3.region': {
    type: 'select',
    label: 'Region',
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
  'file.output': {
    type: 'select',
    label: 'Output Mode',
    options: [
      {
        items: [
          { label: 'Records', value: 'records' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'BlobKeys', value: 'blobKeys' },
        ],
      },
    ],
  },
  'ftp.type': {
    type: 'select',
    label: 'File Type',
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
  'file.json.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['json'],
      },
    ],
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File Has Header',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['xlsx'],
      },
    ],
  },
  'ftp.xlsx.keyColumns': {
    type: 'multiselect',
    label: 'Key Columns',
    visibleWhen: [
      {
        field: 'file.xlsx.rowsPerRecord',
        is: [true],
      },
    ],
  },
  'file.xlsx.rowsPerRecord': {
    type: 'checkbox',
    label: 'Multiple Rows Per Record',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.fileDefinition.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['filedefinition'],
      },
      {
        field: 'ftp.type',
        is: ['fixed'],
      },
      {
        field: 'ftp.type',
        is: ['delimited/edifact'],
      },
    ],
  },
  'file.encoding': {
    type: 'select',
    label: 'File Encoding Type',
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

  'file.skipDelete': {
    type: 'checkbox',
    label: 'Leave File On Server',
  },
  'file.decompressFiles': {
    type: 'checkbox',
    label: 'Decompress Files',
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
    visibleWhen: [
      {
        field: 'file.decompressFiles',
        is: [true],
      },
    ],
  },
  'file.xml.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['xml'],
      },
    ],
  },
  'ftp.csv.columnDelimiter': {
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
        field: 'ftp.type',
        is: ['csv'],
      },
    ],
  },
  'ftp.csv.trimSpaces': {
    type: 'checkbox',
    label: 'Trim Spaces',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['csv'],
      },
    ],
  },
  'ftp.csv.hasHeaderRow': {
    type: 'checkbox',
    label: 'File Has Header',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['csv'],
      },
    ],
  },
  'ftp.csv.rowsToSkip': {
    type: 'text',
    label: 'Number Of Rows To Skip',
    defaultValue: 0,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['csv'],
      },
    ],
  },
  'ftp.csv.rowsPerRecord': {
    type: 'checkbox',
    label: 'Multiple Rows Per Record',
    visibleWhen: [
      {
        field: 'ftp.type',
        is: ['csv'],
      },
    ],
  },
  'ftp.csv.keyColumns': {
    type: 'multiselect',
    label: 'Key Columns',
    visibleWhen: [
      {
        field: 'ftp.csv.rowsPerRecord',
        is: [true],
      },
    ],
  },
  's3.bucket': {
    type: 'text',
    label: 'Bucket Name',
  },
  's3.keyStartsWith': {
    type: 'text',
    label: 'Key Starts With',
  },
  's3.keyEndsWith': {
    type: 'text',
    label: 'Key Ends With',
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
  },
  exportData: {
    type: 'labeltitle',
    label: 'What data would you like to Export?',
  },
  'ftp.exportTransformRecords': {
    label: 'Would you like to transform the records?',
    type: 'labeltitle',
  },
};
