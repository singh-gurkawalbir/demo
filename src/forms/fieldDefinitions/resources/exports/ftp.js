export default {
  uploadFile: {
    type: 'uploadfile',
    // required: true,
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv', 'xml', 'json', 'xlsx'],
      },
      { field: 'file.output', is: ['records'] },
    ],
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },

  'ftp.directoryPath': {
    type: 'text',
    label: 'Directory Path',
    required: true,
  },
  'ftp.fileNameStartsWith': {
    type: 'text',
    label: 'File Name Starts With',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',
    label: 'File Name Ends With',
  },
  'file.output': {
    label: 'Output Mode',
    type: 'select',
    options: [
      {
        items: [
          { label: 'Records', value: 'records' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'Blob Keys', value: 'blobKeys' },
        ],
      },
    ],
  },
  'file.json.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['json'],
      },
      { field: 'file.output', is: ['records'] },
    ],
  },
  'file.xml.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xml'],
      },
      { field: 'file.output', is: ['records'] },
    ],
  },
  'file.fileDefinition.resourcePath': {
    label: 'Resource Path',
    type: 'text',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['filedefinition', 'fixed', 'delimited/edifact'],
      },
      { field: 'file.output', is: ['records'] },
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
    id: 'file.type',
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
    required: true,
    visibleWhen: [{ field: 'file.output', is: ['records'] }],
  },
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV parse options',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
      { field: 'file.output', is: ['records'] },
    ],
    defaultValue: r => r && r.file && r.file.csv,
  },
  'file.xlsx': {
    type: 'csvparse',
    label: 'Configure XLSX parse options',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
      { field: 'file.output', is: ['records'] },
    ],
    defaultValue: r => r && r.file && r.file.xlsx,
  },
  'file.xml': {
    type: 'xmlparse',
    label: 'Configure XML parse options',
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['xml'],
      },
      { field: 'file.output', is: ['records'] },
    ],
    defaultValue: r => r && r.file && r.file.xml,
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
    userDefinitionId: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
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
