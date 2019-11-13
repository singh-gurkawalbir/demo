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
    defaultValue: r => {
      let toReturn = '';

      if (!r || !r.rest) {
        return toReturn;
      }

      if (r.rest.method) {
        if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          toReturn = 'COMPOSITE';
        } else if (r.rest.method && r.rest.method.length === 1) {
          [toReturn] = r.rest.method;
        }
      }

      return toReturn;
    },
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
    defaultValue: r => r && r.rest && r.rest.method && r.rest.method[0],
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
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
    requiredWhen: [
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
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
    defaultValue: r => {
      let type = '';

      if (!r || !r.rest) {
        return type;
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          type = 'createandupdate';
        } else if (r.rest.method.length === 1) {
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
  'rest.relativeURI': {
    type: 'text',
    label: 'Relative URI',
    required: true,
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
    defaultValue: r =>
      r && r.rest && r.rest.relativeURI && r.rest.relativeURI[0],
  },
  'rest.body': {
    type: 'httprequestbody',
    defaultValue: r =>
      Array.isArray(((r || {}).rest || {}).body) ? r.rest.body[0] : undefined,
    label: 'Build HTTP Request Body',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
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
    defaultValue: r =>
      r && r.rest && r.rest.successPath && r.rest.successPath[0],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
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
    defaultValue: r =>
      r && r.rest && r.rest.successValues && r.rest.successValues[0],
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
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    defaultValue: r =>
      r && r.rest && r.rest.responseIdPath && r.rest.responseIdPath[0],
  },
  sampleData: {
    type: 'textarea',
    label: 'If so,please paste it here',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['records'],
      },
      {
        field: 'rest.method',
        isNot: ['DELETE'],
      },
    ],
  },
};
