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
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
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
    visibleWhen: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
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
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
    defaultValue: r =>
      r && r.http && r.http.relativeURI && r.http.relativeURI[0],
  },
  'http.body': {
    type: 'httprequestbody',
    defaultValue: r =>
      Array.isArray(((r || {}).http || {}).body) ? r.http.body[0] : undefined,
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
