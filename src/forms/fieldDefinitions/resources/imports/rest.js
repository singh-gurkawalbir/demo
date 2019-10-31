export default {
  'rest.method': {
    type: 'radiogroup',
    label: 'Method',
    required: true,
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
            value: 'CREATE_AND_UPDATE',
          },
          {
            label: 'Create New Data & Ignore Existing Data',
            value: 'CREATE_AND_IGNORE_EXISTING',
          },
          {
            label: 'Update Existing Data & Ignore NEW Data',
            value: 'UPDATE_AND_IGNORE_NEW',
          },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      let type = '';

      if (!r || !r.rest) {
        return type;
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          type = 'CREATE_AND_UPDATE';
        } else if (r.rest.method.length === 1) {
          if (r.ignoreExisting) {
            type = 'CREATE_AND_IGNORE_EXISTING';
          } else if (r.ignoreMissing) {
            type = 'UPDATE_AND_IGNORE_NEW';
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
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
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
    ],
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
    defaultValue: r =>
      r && r.rest && r.rest.successPath && r.rest.successPath[0],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhen: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
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
    ],
    defaultValue: r =>
      r && r.rest && r.rest.responseIdPath && r.rest.responseIdPath[0],
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
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return r.rest.method[1];
        }

        return r.rest.method[0];
      }

      return '';
    },
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
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
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return r.rest.relativeURI && r.rest.relativeURI[1];
        }

        return r.rest.relativeURI && r.rest.relativeURI[0];
      }

      return '';
    },
  },
  'rest.bodyCreate': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return Array.isArray(((r || {}).rest || {}).body)
            ? r.rest.body[1]
            : undefined;
        }

        return Array.isArray(((r || {}).rest || {}).body)
          ? r.rest.body[0]
          : undefined;
      }

      return '';
    },
  },
  'rest.successPathCreate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return r.rest.successPath && r.rest.successPath[1];
        }

        return r.rest.successPath && r.rest.successPath[0];
      }

      return '';
    },
  },
  'rest.successValuesCreate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return r.rest.successValues && r.rest.successValues[1];
        }

        return r.rest.successValues && r.rest.successValues[0];
      }

      return '';
    },
  },
  'rest.responseIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.rest.method.length > 1) {
          return r.rest.responseIdPath && r.rest.responseIdPath[1];
        }

        return r.rest.responseIdPath && r.rest.responseIdPath[0];
      }

      return '';
    },
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
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.rest.method[0];
      }

      return '';
    },
  },
  'rest.relativeURIUpdate': {
    type: 'text',
    label: 'Relative URI',
    required: true,
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.rest.relativeURI && r.rest.relativeURI[0];
      }

      return '';
    },
  },
  'rest.bodyUpdate': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return Array.isArray(((r || {}).rest || {}).body)
          ? r.rest.body[0]
          : undefined;
      }

      return '';
    },
  },
  'rest.successPathUpdate': {
    type: 'text',
    label: 'Success Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.rest.successPath && r.rest.successPath[0];
      }

      return '';
    },
  },
  'rest.successValuesUpdate': {
    type: 'text',
    label: 'Success Values',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.rest.successValues && r.rest.successValues[0];
      }

      return '';
    },
  },
  'rest.responseIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest || !r.rest.method) {
        return '';
      }

      if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.rest.responseIdPath && r.rest.responseIdPath[0];
      }

      return '';
    },
  },
  'rest.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.compositeType',
        is: ['CREATE_AND_IGNORE_EXISTING', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'rest.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.rest) {
        return '';
      }

      if (r.rest.ignoreLookupName) {
        return r.rest.ignoreLookupName;
      } else if (r.rest.ignoreExtract) {
        return r.rest.ignoreExtract;
      }

      return '';
    },
  },
  'rest.sampleData': {
    type: 'textarea',
    label: 'If so,please paste it here',
  },
  visibleWhen: [
    {
      field: 'rest.method',
      isNot: ['DELETE'],
    },
  ],
};
