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
    defaultValue: r => (r && r.http ? r && r.http.requestMediaType : 'xml'),
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

  'http.relativeURI': {
    type: 'relativeuriwithlookup',
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
      Array.isArray(((r || {}).http || {}).body) ? r.http.body[0] : undefined,
    label: 'Build HTTP Request Body',
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
        isNot: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
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
