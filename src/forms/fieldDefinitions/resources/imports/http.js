export default {
  'http.method': {
    type: 'radiogroup',
    label: 'Method',
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
    label: 'Request Media Type',
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
            value: 'createandupdate',
          },
          {
            label: 'Create New Data & Ignore Existing Data',
            value: 'createandignore',
          },
          {
            label: 'Update Existing Data & Ignore NEW Data',
            value: 'updateandignore',
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
  'http.relativeURI': {
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
  'http.body': {
    type: 'httprequestbody',
    defaultValue: [],
    label: 'Build HTTP Request Body',
    refreshOptionsOnChangesTo: ['http.lookups'],
  },
  'http.response.successPath': {
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
  'http.response.successValues': {
    type: 'text',
    label: 'Success Values',
    delimiter: ',',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.response.resourceIdPath': {
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
  'http.response.resourcePath': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
  },
  'http.response.errorPath': {
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
  'http.batchSize': {
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
        is: ['createandupdate', 'createandignore'],
      },
    ],
  },
  'http.relativeURICreate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
    ],
  },
  'http.bodyCreate': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body For Create',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
    ],
  },
  'http.resourceIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
    ],
  },
  'http.resourcePathCreate': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
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
        is: ['createandupdate', 'updateandignore'],
      },
    ],
  },
  'http.relativeURIUpdate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
    ],
  },
  'http.resourceIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
    ],
  },
  'http.resourcePathUpdate': {
    type: 'text',
    label: 'Response Path',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
    ],
  },
  'http.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['createandignore', 'updateandignore'],
      },
    ],
    requiredWhen: [
      {
        field: 'http.compositeType',
        is: ['createandignore', 'updateandignore'],
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
  'http.ignoreEmptyNodes': {
    type: 'checkbox',
    label: 'Ignore Empty Nodes',
  },
  'http.configureAsyncHelper': {
    type: 'checkbox',
    label: 'Configure Async Helper',
  },
  'http._asyncHelperId': {
    type: 'select',
    label: 'Async Helper',
    options: [
      {
        // To Do statistically instead of dynamic
        items: [{ label: 'NewAsynchHelper', value: 'newasynchhelper' }],
      },
    ],
    visibleWhen: [
      {
        field: 'http.configureAsyncHelper',
        is: [true],
      },
    ],
  },
};
