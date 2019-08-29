export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be imported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    // filter: r => ({ type: r.type }),y
    // excludeFilter: r => ({ _
    //
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx'],
      },
    ],
  },
  'file.type': {
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
  'file.compressFiles': {
    type: 'checkbox',
    label: 'Compress Files',
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
    visibleWhen: [
      {
        field: 'file.compressFiles',
        is: [true],
      },
    ],
    requiredWhen: [
      {
        field: 'file.compressFiles',
        is: [true],
      },
    ],
  },
  'file.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.columnDelimiter': {
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
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
      { field: 'file.output', is: ['records'] },
    ],
  },
  'file.skipAggregation': {
    type: 'checkbox',
    label: 'Skip Aggregation',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'json', 'xlsx', 'xml'],
      },
    ],
  },
  'file.csv.rowDelimiter': {
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
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'xlsx'],
      },
    ],
  },
  'file.ediX12Format': {
    type: 'select',
    label: 'EDI X12 Format',
    // dummy values
    options: [
      {
        items: [
          { label: 'Generic 180', value: 'generic180' },
          { label: 'Generic 850', value: 'generic850' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
    ],
    requiredWhen: [
      {
        field: 'file.type',
        is: ['filedefinition'],
      },
    ],
  },
  'file.format': {
    type: 'select',
    label: 'Format',
    // dummy values
    options: [
      {
        items: [
          { label: 'AgoNow Inbound 810', value: 'agonow810' },
          { label: 'AgoNow Inbound 855', value: 'agonow855' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
    ],
    requiredWhen: [
      {
        field: 'file.type',
        is: ['fixed'],
      },
    ],
  },
  'file.edifactFormat': {
    type: 'select',
    label: 'EDIFACT Format',
    // dummy values
    options: [
      {
        items: [
          { label: 'AMAZON VC INVOIC', value: 'amazonvcinvoice' },
          { label: 'AMAZON VC ORDERS', value: 'amazonvcorders' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
    ],
    requiredWhen: [
      {
        field: 'file.type',
        is: ['delimited/edifact'],
      },
    ],
  },
  'file.parentOption': {
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
  'file.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'file.parentOption',
        is: ['true'],
      },
    ],
  },
  'file.concurrencyIdLockTemplate': {
    type: 'textarea',
    label: 'Concurrency Id Lock Template',
  },
  'file.dataUriTemplate': {
    type: 'text',
    label: 'Data URI Template',
    placeholder: 'Optional',
  },
};
