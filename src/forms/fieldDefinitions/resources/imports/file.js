export default {
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
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
  ediFactFormat: {
    type: 'select',
    label: 'EDIFACT Format',
    // To Do replace statistcally instead dynamic values
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
  ediFormat: {
    type: 'select',
    label: 'Format',
    // To Do replace statistcally instead dynamic values
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
  ediX12Format: {
    type: 'select',
    label: 'EDI X12 Format',
    // To Do replace statistcally instead dynamic values
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
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be imported)',
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
  'file.csv.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.xlsx.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['xlsx'],
      },
    ],
  },
  'file.csv.customHeaderRows': {
    type: 'textarea',
    label: 'Custom Header Rows',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'file.compressionFormat': {
    type: 'select',
    label: 'Compression Format',
    options: [{ items: [{ label: 'gzip', value: 'gzip' }] }],
  },
  'file.csv.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
  'file.csv.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv'],
      },
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
    visibleWhenAll: [
      {
        field: 'file.type',
        is: ['csv'],
      },
    ],
  },
};
