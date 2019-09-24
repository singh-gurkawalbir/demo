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
          { label: 'UTF-8', value: 'utf8' },
          { label: 'Windows-1252', value: 'win1252' },
          { label: 'UTF-16LE', value: 'utf-16le' },
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
  'file.output': {
    type: 'select',
    label: 'Output Mode',
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
  'file.skipDelete': {
    type: 'checkbox',
    label: 'Leave File On Server',
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
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
          { label: 'Comma', value: ',' },
          { label: 'Pipe', value: '|' },
          { label: 'Semicolumn', value: ';' },
          { label: 'Space', value: ' ' },
          { label: 'Tab', value: '\t' },
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
    label: 'Resource Path',
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File Has Header:',
  },
  'file.xlsx.keyColumns': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Key Columns',
  },
  'file.xml.resourcePath': {
    type: 'text',
    label: 'Resource Path',
  },
  'file.fileDefinition.resourcePath': {
    type: 'text',
    label: 'Resource Path',
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',
    label: 'File file Definition _file Definition Id',
  },
};
