export default {
  'http.method': {
    type: 'select',
    label: 'HTTP method',
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
    helpKey: 'import.http.method',
    label: 'HTTP method',
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
    label: 'Configure HTTP headers',
  },
  'http.requestMediaType': {
    type: 'selectrequestmediatype',
    label: 'Override request media type',
    placeholder: 'Do not override',
    defaultValue: r => (r && r.http ? r && r.http.requestMediaType : 'json'),
  },
  'http.compositeType': {
    type: 'select',
    label: 'Composite type',
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
    label: 'Request type',
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
    type: 'relativeuri',
    fieldType: 'relativeUri',
    label: 'Relative URI',
    arrayIndex: 0,
    connectionId: r => r && r._connectionId,
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
    label: 'HTTP request body',
    requestMediaType: r =>
      r && r.http ? r && r.http.requestMediaType : 'json',
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
    label: 'Path to success field in HTTP response body',
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
  'http.response.successValues': {
    type: 'text',
    label: 'Success values',
    delimiter: ',',
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
    helpKey: r => {
      if (r?.resourceType === 'transferFiles' || r?.blob) { return 'import.http.response.file.resourceIdPath'; }

      return 'import.http.response.resourceIdPath';
    },
    label: 'Path to id field in HTTP response body',
    delimiter: ',',
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
    label: 'Path to error field in HTTP response body',
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
    label: 'Error values',
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
    label: 'Path to records in HTTP response body',
    visibleWhenAll: [
      {
        field: 'http.batchSize',
        isNot: ['', 0, 1],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Path to detailed error message field in HTTP response body',
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
    label: 'Number of records per HTTP request',
    defaultValue: r => r?.http?.batchSize || 1,
    validWhen: {
      matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
    },
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
    label: 'Override media type for success responses',
    placeholder: 'Do not override',
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
    label: 'Override media type for error responses',
    placeholder: 'Do not override',
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
    label: 'Remove empty fields from HTTP request body',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.configureAsyncHelper': {
    type: 'checkbox',
    label: 'Configure async helper',
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
    label: 'Async helper',
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
