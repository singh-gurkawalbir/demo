export default {
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'xml', 'json', 'xlsx'],
      },
    ],
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
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
  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
  },
  'ftp.fileNameStartsWith': {
    type: 'text',
    label: 'File Name Starts With',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',
    label: 'File Name Ends With',
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
  'file.output': {
    label: 'Output Mode',
    type: 'select',
    options: [
      {
        items: [
          { label: 'Records', value: 'records' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'Blob Keys', value: 'blobkeys' },
        ],
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
  'file.type': {
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
    type: 'multiselect',
    label: 'Key Columns',
    visibleWhen: [
      {
        field: 'file.xlsx.rowsPerRecord',
        is: [true],
      },
    ],
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
  // #region transform
  'transform.expression.rules': {
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    type: 'text',
    label: 'Transform script _script Id',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
};
