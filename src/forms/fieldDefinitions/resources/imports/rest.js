export default {
  'rest.method': {
    type: 'radiogroup',
    label: 'Method',
    required: true,
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
  'rest.blobMethod': {
    type: 'radiogroup',
    label: 'Method',
    required: true,
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'rest.headers': {
    type: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'rest.compositeType': {
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
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.relativeURI': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'rest.blobMethod',
        is: ['POST', 'PUT', 'DELETE'],
      },
    ],
  },
  mapping: {
    type: 'mapping',
    connectionId: r => r && r._connectionId,
    label: 'Manage Import Mapping',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.body': {
    type: 'httprequestbody',
    defaultValue: [],
    label: 'Build HTTP Request Body',
    refreshOptionsOnChangesTo: ['rest.lookups'],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
    delimiter: ',',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.responseIdPath': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'rest.blobMethod',
        is: ['POST', 'PUT', 'DELETE'],
      },
    ],
  },
  'rest.compositeMethodCreate': {
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
        field: 'rest.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.relativeURICreate': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successPathCreate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successValuesCreate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.responseIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'createandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.compositeMethodUpdate': {
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
        field: 'rest.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.relativeURIUpdate': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successPathUpdate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successValuesUpdate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.responseIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandupdate', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['createandignore', 'updateandignore'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'rest.sampleData': {
    type: 'textarea',
    label: 'If so,please paste it here',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
};
