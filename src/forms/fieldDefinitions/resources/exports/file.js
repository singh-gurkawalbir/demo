export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },
  'file.encoding': {
    type: 'select',
    label: 'File encoding',
    options: [
      {
        items: [
          { label: 'Utf8', value: 'utf8' },
          { label: 'Win1252', value: 'win1252' },
          { label: 'Utf-16le', value: 'utf-16le' },
        ],
      },
    ],
  },
  'file.type': {
    type: 'select',
    label: 'File type',
    options: [
      {
        items: [
          { label: 'Csv', value: 'csv' },
          { label: 'Json', value: 'json' },
          { label: 'Xlsx', value: 'xlsx' },
          { label: 'Xml', value: 'xml' },
          // { label: 'Filedefinition', value: 'filedefinition' },
          { label: 'Edi', value: 'edi' },
          { label: 'Fixed width', value: 'fixedWidth' },
        ],
      },
    ],
  },
  'file.output': {
    type: 'select',
    label: 'File output',
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
  'file.skipDelete': {
    type: 'checkbox',
    label: 'Leave File On Server',
  },
  'file.compressionFormat': {
    type: 'checkbox',
    label: 'Decompress files of Gzip file format',
    options: [{ items: [{ label: 'Gzip', value: 'gzip' }] }],
  },
  'file.purgeInternalBackup': {
    type: 'checkbox',
    label: 'File purge Internal Backup',
  },
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV parse options',
    sampleData: r => r.sampleData,
  },
  'file.csv.columnDelimiter': {
    type: 'select',
    label: 'File csv column Delimiter',
    options: [
      {
        items: [
          { label: 'Comma', value: 'comma' },
          { label: 'Pipe', value: 'pipe' },
          { label: 'Semicolumn', value: 'semicolumn' },
          { label: 'Space', value: 'space' },
          { label: 'Tab', value: 'tab' },
        ],
      },
    ],
  },
  'file.csv.rowDelimiter': {
    type: 'text',
    label: 'File csv row Delimiter',
  },
  'file.csv.keyColumns': {
    type: 'text',
    label: 'File csv key Columns',
  },
  'file.csv.hasHeaderRow': {
    type: 'checkbox',
    label: 'File csv has Header Row',
  },
  'file.csv.trimSpaces': {
    type: 'checkbox',
    label: 'File csv trim Spaces',
  },
  'file.csv.rowsToSkip': {
    type: 'text',
    label: 'File csv rows To Skip',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'file.json.resourcePath': {
    type: 'text',
    label: 'File json resource Path',
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File xlsx has Header Row',
  },
  'file.xlsx.keyColumns': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'File xlsx key Columns',
    validWhen: [],
  },
  'file.xml.resourcePath': {
    type: 'text',
    label: 'File xml resource Path',
  },
  'file.fileDefinition.resourcePath': {
    type: 'text',
    label: 'File file Definition resource Path',
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',
    label: 'File file Definition _file Definition Id',
  },
};
