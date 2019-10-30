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
          type = 'CREATE_AND_UPDATE';
        } else if (r.http.method.length === 1) {
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
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          return r.http.method[1];
        }

        return r.http.method[0];
      }

      return '';
    },
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
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
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          return r.http.relativeURI[1];
        }

        return r.http.relativeURI[0];
      }

      return '';
    },
  },
  'http.bodyCreate': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body For Create',
    refreshOptionsOnChangesTo: ['http.lookups'],
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          return r.http.body[1];
        }

        return r.http.body[0];
      }

      return '';
    },
  },
  'http.resourceIdPathCreate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          return (
            r.http.response &&
            r.http.response.resourceIdPath &&
            r.http.response.resourceIdPath[1]
          );
        }

        return (
          r.http.response &&
          r.http.response.resourceIdPath &&
          r.http.response.resourceIdPath[0]
        );
      }

      return '';
    },
  },
  'http.resourcePathCreate': {
    type: 'text',
    label: 'Response Path',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE_EXISTING'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          return r.http.resourcePath && r.http.resourcePath[1];
        }

        return r.http.resourcePath && r.http.resourcePath[0];
      }

      return '';
    },
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
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.http.method && r.http.method[0];
      }

      return '';
    },
  },
  'http.relativeURIUpdate': {
    type: 'text',
    label: 'Relative URI',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return r.http.relativeURI && r.http.relativeURI[0];
      }

      return '';
    },
  },
  'http.resourceIdPathUpdate': {
    type: 'text',
    label: 'Response Id Path',
    placeholder: 'Optional',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return (
          r.http.response &&
          r.http.response.resourceIdPath &&
          r.http.response.resourceIdPath[0]
        );
      }

      return '';
    },
  },
  'http.resourcePathUpdate': {
    type: 'text',
    label: 'Response Path',
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE_NEW'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http || !r.http.method) {
        return '';
      }

      if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        return (
          r.http.response &&
          r.http.response.resourcePath &&
          r.http.response.resourcePath[0]
        );
      }

      return '';
    },
  },
  'http.existingDataId': {
    type: 'text',
    label: 'Existing Data Id',
    visibleWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_IGNORE_EXISTING', 'UPDATE_AND_IGNORE_NEW'],
      },
    ],
    requiredWhen: [
      {
        field: 'http.compositeType',
        is: ['CREATE_AND_IGNORE_EXISTING', 'UPDATE_AND_IGNORE_NEW'],
      },
    ],
    defaultValue: r => {
      if (!r || !r.http) {
        return '';
      }

      if (r.http.ignoreLookupName) {
        return r.http.ignoreLookupName;
      } else if (r.http.ignoreExtract) {
        return r.http.ignoreExtract;
      }

      return '';
    },
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
