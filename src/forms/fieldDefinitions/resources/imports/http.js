export default {
  'http.method': {
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
    defaultValue: r => {
      let toReturn = '';

      if (!r || !r.http) {
        return toReturn;
      }

      if (r.http.method) {
        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          toReturn = 'COMPOSITE';
        } else if (r.http.method && r.http.method.length === 1) {
          [toReturn] = r.http.method;
        }
      }

      return toReturn;
    },
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
    defaultValue: r => r && r.http && r.http.method && r.http.method[0],
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
    defaultValue: r => (r && r.http ? r && r.http.requestMediaType : 'json'),
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
            label: 'Update Existing Data & Ignore New Data',
            value: 'updateandignore',
          },
        ],
      },
    ],
    requiredWhen: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
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
    defaultValue: r => {
      let type = '';

      if (!r || !r.http) {
        return type;
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          type = 'createandupdate';
        } else if (r.http.method.length === 1) {
          if (r.ignoreExisting) {
            type = 'createandignore';
          } else if (r.ignoreMissing) {
            type = 'updateandignore';
          }
        }
      }

      return type;
    },
  },
  'http.requestType': {
    type: 'select',
    label: 'Request Type',
    options: [
      {
        items: [
          {
            label: 'CREATE',
            value: 'CREATE',
          },
          {
            label: 'UPDATE',
            value: 'UPDATE',
          },
        ],
      },
    ],
    helpText:
      'Please specify whether the record is being created or updated using this field.',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
    defaultValue: r =>
      r && r.http && r.http.requestType && r.http.requestType[0],
  },
  'http.relativeURI': {
    type: 'textwithlookupextract',
    fieldType: 'relativeUri',
    label: 'Relative URI',
    placeholder: 'Optional',
    arrayIndex: 0,
    connectionId: r => r && r._connectionId,
    refreshOptionsOnChangesTo: ['http.lookups', 'name'],
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    defaultValue: r =>
      r && r.http && r.http.relativeURI && r.http.relativeURI[0],
  },
  'http.body': {
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    arrayIndex: 0,
    defaultValue: r =>
      Array.isArray(((r || {}).http || {}).body) ? r.http.body[0] : '',
    label: 'Build HTTP Request Body',
    required: true,
    requestMediaType: r =>
      r && r.http ? r && r.http.requestMediaType : 'json',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhen: [
      {
        field: 'http.method',
        isNot: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Success Path',
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
  'http.response.successValues': {
    type: 'text',
    label: 'Success Values',
    delimiter: ',',
    placeholder: 'Optional',
    // defaultValue: r =>
    //   r && r.http && r.http.response && r.http.response.successValues[0],
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
    delimiter: ',',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        isNot: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'http.response.failPath': {
    type: 'text',
    label: 'Fail Path',
    delimiter: ',',
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
  'http.response.failValues': {
    type: 'text',
    delimiter: ',',
    label: 'Fail Values',
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
  'http.response.resourcePath': {
    type: 'text',
    delimiter: ',',
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
  'http.successMediaType': {
    type: 'select',
    label: 'Success Media Type',
    visibleWhenAll: [
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
    defaultValue: r => !!(r && r.http && r.http._asyncHelperId),
    visible: r => !(r && r.statusExport),
    visibleWhen: r => {
      if (r && r.statusExport) return [];

      return [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ];
    },
  },

  'http._asyncHelperId': {
    label: 'Async Helper',
    type: 'selectresource',
    resourceType: 'asyncHelpers',
    appTypeIsStatic: true,
    options: { appType: 'Async Helpers' },
    allowNew: true,
    allowEdit: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['records'],
      },
      { field: 'http.configureAsyncHelper', is: [true] },
    ],
  },
};
