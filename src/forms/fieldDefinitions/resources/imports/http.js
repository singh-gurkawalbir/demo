export default {
  'http.method': {
    type: 'radiogroup',
    label: 'Method',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
  'http.blobMethod': {
    type: 'select',
    label: 'Method',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    label: 'Configure HTTP Headers',
  },
  'http.requestMediaType': {
    type: 'select',
    label: 'Request Media Type',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
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
      {
        field: 'http.blobMethod',
        is: ['POST', 'PUT', 'DELETE'],
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
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.successValues': {
    type: 'text',
    label: 'Success Values',
    delimiter: ',',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.resourceIdPath': {
    type: 'text',
    label: 'Resource Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'http.blobMethod',
        is: ['POST', 'PUT', 'DELETE'],
      },
    ],
  },
  'http.response.resourcePath': {
    type: 'text',
    label: 'Response Path',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Error Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.batchSize': {
    type: 'text',
    label: 'Batch Size Limit',
    defaultValue: 1,
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
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
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.relativeURICreate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.bodyCreate': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body For Create',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.resourceIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.resourcePathCreate': {
    type: 'text',
    label: 'Response Path',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
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
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.relativeURIUpdate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.resourceIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.resourcePathUpdate': {
    type: 'text',
    label: 'Response Path',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandignore', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
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
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.configureAsyncHelper': {
    type: 'checkbox',
    label: 'Configure Async Helper',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
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
    visibleWhenAll: [
      {
        field: 'http.configureAsyncHelper',
        is: [true],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
