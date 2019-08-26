export default {
  'http.parentOption': {
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
  'http.childRecords': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'http.parentOption',
        is: ['true'],
      },
    ],
  },
  'http.method': {
    type: 'radiogroup',
    label: 'Http request Media Type',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'Composite', value: 'COMPOSITE' },
        ],
      },
    ],
  },
  'http.headers': {
    type: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'http.requestMediaType': {
    type: 'select',
    label: 'Http request Media Type',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
          { label: 'CSV', value: 'csv' },
          { label: 'URL Encoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'http.compositeType': {
    type: 'select',
    label: 'Composite Type',
    options: [
      {
        items: [
          {
            label: 'Create New Data & Update Existing Data',
            value: 'CREATE_AND_UPDATE',
          },
          {
            label: 'Create New Data & Ignore Existing Data',
            value: 'CREATE_AND_IGNORE',
          },
          {
            label: 'Update Existing Data & Ignore NEW Data',
            value: 'UPDATE_AND_IGNORE',
          },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
  },
  'http.relativeUri': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.successPath': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.successValues': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.responseIdPath': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.responsePath': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.errorPath': {
    type: 'text',
    label: 'Error Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.batchSizeLimit': {
    type: 'text',
    label: 'Batch Size Limit',
    defaultValue: 1,
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.createNewData': {
    type: 'labeltitle',
    label: 'Create New Data',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'http.compositeMethodCreate': {
    type: 'select',
    label: 'HTTP Method',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'http.relativeUriCreate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'http.responseIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'http.responsePathCreate': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
      },
    ],
  },
  'http.upateExistingData': {
    type: 'labeltitle',
    label: 'Upate Existing Data',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.compositeMethodUpdate': {
    type: 'select',
    label: 'HTTP Method',
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.relativeUriUpdate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.responseIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.responsePathUpdate': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.ignoreExistingData': {
    type: 'labeltitle',
    label: 'Ignore Existing Data',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_IGNORE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_IGNORE', 'UPDATE_AND_IGNORE'],
      },
    ],
  },
  'http.successMediaType': {
    type: 'select',
    label: 'Success Media Type',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
        ],
      },
    ],
  },
  'http.errorMediaType': {
    type: 'select',
    label: 'Error Media Type',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
        ],
      },
    ],
  },
  'http.sampleFile': {
    type: 'uploadfile',
    label: 'Sample File (that would be imported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.columnDelimiter': {
    type: 'select',
    label: 'Column Delimiter',
    options: [
      {
        items: [
          { label: 'Comma', value: ',' },
          { label: 'Pipe', value: '|' },
          { label: 'Semicolon', value: ';' },
          { label: 'Space', value: '' },
          { label: 'Tab', value: '\t' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.includeHeader': {
    type: 'checkbox',
    label: 'Include Header',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.customHeaderRows': {
    type: 'textarea',
    label: 'Custom Header Rows',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.parentOptionMapping': {
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
  'http.childRecordsMapping': {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'http.parentOptionMapping',
        is: ['true'],
      },
    ],
  },
  'http.rowDelimiter': {
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
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.wrapWithQuotes': {
    type: 'checkbox',
    label: 'Wrap with quotes',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.replaceTabWithSpace': {
    type: 'checkbox',
    label: 'Replace tab with space',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.replaceNewLineWithSpace': {
    type: 'checkbox',
    label: 'Replace new line with space',
    visibleWhen: [
      {
        field: 'http.requestMediaType',
        is: ['csv'],
      },
    ],
  },
  'http.ignoreEmptyNodes': {
    type: 'checkbox',
    label: 'Ignore Empty Nodes',
  },
  'http.concurrencyIdLockTemplate': {
    type: 'textarea',
    label: 'Concurrency Id Lock Template',
  },
  'http.dataUriTemplate': {
    type: 'text',
    label: 'Data URI Template',
    placeholder: 'Optional',
  },
  'http.configureAsyncHelper': {
    type: 'checkbox',
    label: 'Configure Async Helper',
  },
};
