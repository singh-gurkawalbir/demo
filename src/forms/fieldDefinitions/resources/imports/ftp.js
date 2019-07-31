export default {
  'ftp.directoryPath': {
    type: 'text',
    label: 'Ftp directory Path',
    placeholder: 'Enter FTP folder path, such as: MySite/Orders',
    defaultValue: '',
    required: true,
  },
  'ftp.fileType': {
    type: 'select',
    label: 'File Type',
    defaultValue: 'Please Select',
    required: true,
    options: [
      {
        items: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'XLSX', value: 'xlsx' },
          { label: 'XML', value: 'xml' },
          { label: 'EDIX12', value: 'edi' },
          { label: 'Fixed Width', value: 'fixedwidth' },
          { label: 'EDIFACT', value: 'edifact' },
        ],
      },
    ],
  },
  'ftp.fileName': {
    type: 'text',
    label: 'Ftp File Name',
    defaultValue: '',
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
        is: ['csv'],
      },
      {
        field: 'ftp.fileType',
        is: ['json'],
      },
      {
        field: 'ftp.fileType',
        is: ['xlsx'],
      },
    ],
  },
  'ftp.columnDelimiter': {
    type: 'select',
    label: 'Column Delimiter',
    options: [
      {
        items: [
          { label: 'Comma', value: 'comma' },
          { label: 'Pipe', value: 'pipe' },
          { label: 'Semicolon', value: 'semicolon' },
          { label: 'Space', value: 'space' },
          { label: 'Tab', value: 'tab' },
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
        is: ['csv'],
      },
      {
        field: 'ftp.fileType',
        is: ['xlsx'],
      },
    ],
  },
  'ftp.fileDefinitionRules': {
    type: 'button',
    label: '',
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['edi'],
      },
      {
        field: 'ftp.fileType',
        is: ['fixedwidth'],
      },
      {
        field: 'ftp.fileType',
        is: ['edifact'],
      },
    ],
  },
  'ftp.advanceOption': {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'Y' },
          { label: 'No', value: 'N' },
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
        field: 'ftp.advanceOption',
        is: ['Y'],
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
    defaultValue: false,
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
    defaultValue: false,
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
      {
        field: 'ftp.fileType',
        is: ['json'],
      },
      {
        field: 'ftp.fileType',
        is: ['xlsx'],
      },
      {
        field: 'ftp.fileType',
        is: ['xml'],
      },
    ],
  },
  'ftp.compressFiles': {
    type: 'checkbox',
    label: 'Compress Files',
    defaultValue: false,
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
    defaultValue: false,
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
    defaultValue: false,
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
    defaultValue: false,
    visibleWhen: [
      {
        field: 'ftp.fileType',
        is: ['csv'],
      },
    ],
  },
  hookType: {
    type: 'radiogroup',
    label: 'Hook Type',
    defaultValue: 'script',
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.preMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.preMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.preMap._scriptId': {
    type: 'selectresource',
    placeholder: 'Please select a script',
    resourceType: 'scripts',
    label: 'Pre Map Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preMap._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Pre Map Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postMap._scriptId': {
    type: 'selectresource',
    placeholder: 'Please select a script',
    resourceType: 'scripts',
    label: 'Post Map Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postMap._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Map Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    requiredWhen: [
      {
        field: 'hooks.postSubmit._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postSubmit._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postSubmit._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Post Submit Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postSubmit._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Post Submit Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
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
