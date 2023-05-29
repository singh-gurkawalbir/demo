import { convertGraphQLQueryToHTTPBody } from '../../../utils/graphql';
import http from './http';
/* eslint-disable no-param-reassign */
export default {
  preSave: formValues => {
    const retValues = {...formValues};

    // graphql specific values
    retValues['/http/formType'] = 'graph_ql';

    // relative URI
    retValues['/http/relativeURI'] = '/';
    retValues['/http/relativeURIUpdate'] = '/';
    retValues['/http/relativeURICreate'] = '/';

    // http.body
    retValues['/http/body'] = convertGraphQLQueryToHTTPBody({
      query: retValues['/graphql/query'],
      variables: retValues['/graphql/variables'],
      operationName: retValues['/graphql/operationName'],
    });

    // http.bodyCreate
    retValues['/http/bodyCreate'] = convertGraphQLQueryToHTTPBody({
      query: retValues['/graphql/queryCreate'],
      variables: retValues['/graphql/variablesCreate'],
      operationName: retValues['/graphql/operationNameCreate'],
    });

    // http.bodyUpdate
    retValues['/http/bodyUpdate'] = convertGraphQLQueryToHTTPBody({
      query: retValues['/graphql/queryUpdate'],
      variables: retValues['/graphql/variablesUpdate'],
      operationName: retValues['/graphql/operationNameUpdate'],
    });

    delete retValues['/graphql/query'];
    delete retValues['/graphql/variables'];
    delete retValues['/graphql/operationName'];
    delete retValues['/graphql/queryCreate'];
    delete retValues['/graphql/variablesCreate'];
    delete retValues['/graphql/operationNameCreate'];
    delete retValues['/graphql/queryUpdate'];
    delete retValues['/graphql/variablesUpdate'];
    delete retValues['/graphql/operationNameUpdate'];

    return http.preSave(retValues);
  },

  fieldMap: {
    common: { formId: 'common' },
    dataMappings: { formId: 'dataMappings' },
    formView: { fieldId: 'formView' },
    inputMode: {
      id: 'inputMode',
      type: 'mode',
      label: 'Input mode',
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'transferFiles' || r.blob) return 'blob';

        return 'records';
      },
    },
    'http.method': { fieldId: 'http.method' },
    'http.compositeType': { fieldId: 'http.compositeType' },
    'http.lookups': { fieldId: 'http.lookups', visible: false },
    'http.response.resourceIdPath': { fieldId: 'http.response.resourceIdPath' },
    'http.compositeMethodCreate': {
      id: 'http.compositeMethodCreate',
      helpKey: 'import.http.method',
      type: 'select',
      required: true,
      label: 'HTTP method',
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
          is: ['createandupdate', 'createandignore'],
        },
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
    'http.failPathCreate': {
      id: 'http.failPathCreate',
      helpKey: 'import.http.response.failPath',
      type: 'text',
      label: 'Path to error field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return (
              r.http.response &&
              r.http.response.failPath &&
              r.http.response.failPath[1]
            );
          }

          if (
            Array.isArray(
              r && r.http && r.http.response && r.http.response.failPath
            )
          ) {
            return r.http.response.failPath[0];
          }

          return r && r.http && r.http.response && r.http.response.failPath;
        }

        return '';
      },
    },
    'http.failValuesCreate': {
      id: 'http.failValuesCreate',
      helpKey: 'import.http.response.failValues',
      type: 'text',
      label: 'Error values',
      delimiter: ',',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return (
              r.http.response &&
              r.http.response.failValues &&
              r.http.response.failValues[1]
            );
          }

          if (
            Array.isArray(
              r &&
                r.http &&
                r.http.response &&
                r.http.response.failValues &&
                r.http.response.failValues[0]
            )
          ) {
            return r.http.response.failValues[0];
          }

          return r && r.http && r.http.response && r.http.response.failValues;
        }

        return '';
      },
    },
    'http.failPathUpdate': {
      id: 'http.failPathUpdate',
      helpKey: 'import.http.response.failPath',
      type: 'text',
      label: 'Path to error field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (
            Array.isArray(
              r && r.http && r.http.response && r.http.response.failPath
            )
          ) {
            return r.http.response.failPath[0];
          }

          return r && r.http && r.http.response && r.http.response.failPath;
        }

        return '';
      },
    },
    'http.failValuesUpdate': {
      id: 'http.failValuesUpdate',
      helpKey: 'import.http.response.failValues',
      type: 'text',
      label: 'Error values',
      delimiter: ',',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (
            Array.isArray(
              r &&
                r.http &&
                r.http.response &&
                r.http.response.failValues &&
                r.http.response.failValues[0]
            )
          ) {
            return r.http.response.failValues[0];
          }

          return r && r.http && r.http.response && r.http.response.failValues;
        }

        return '';
      },
    },
    'http.resourceIdPathCreate': {
      id: 'http.resourceIdPathCreate',
      helpKey: 'import.http.response.resourceIdPath',
      type: 'text',
      label: 'Path to id field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
      id: 'http.resourcePathCreate',
      helpKey: 'import.http.response.resourcePath',
      type: 'text',
      label: 'Path to records in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return (
              r.http.response &&
              r.http.response.resourcePath &&
              r.http.response.resourcePath[1]
            );
          }

          return (
            r.http.response &&
            r.http.response.resourcePath &&
            r.http.response.resourcePath[0]
          );
        }

        return '';
      },
    },
    'http.successPathCreate': {
      id: 'http.successPathCreate',
      helpKey: 'import.http.response.successPath',
      type: 'text',
      label: 'Path to success field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return (
              r.http.response &&
              r.http.response.successPath &&
              r.http.response.successPath[1]
            );
          }

          if (
            Array.isArray(
              r && r.http && r.http.response && r.http.response.successPath
            )
          ) {
            return r.http.response.successPath[0];
          }

          return r && r.http && r.http.response && r.http.response.successPath;
        }

        return '';
      },
    },
    'http.successValuesCreate': {
      id: 'http.successValuesCreate',
      helpKey: 'import.http.response.successValues',
      type: 'text',
      label: 'Success values',
      delimiter: ',',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return (
              r.http.response &&
              r.http.response.successValues &&
              r.http.response.successValues[1]
            );
          }

          if (
            Array.isArray(
              r &&
                r.http &&
                r.http.response &&
                r.http.response.successValues &&
                r.http.response.successValues[0]
            )
          ) {
            return r.http.response.successValues[0];
          }

          return (
            r && r.http && r.http.response && r.http.response.successValues
          );
        }

        return '';
      },
    },
    'http.compositeMethodUpdate': {
      id: 'http.compositeMethodUpdate',
      helpKey: 'import.http.method',
      type: 'select',
      required: true,
      label: 'HTTP method',
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
          field: 'http.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
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
    'http.resourceIdPathUpdate': {
      id: 'http.resourceIdPathUpdate',
      helpKey: 'import.http.response.resourceIdPath',
      type: 'text',
      label: 'Path to id field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'http.resourcePathUpdate',
      helpKey: 'import.http.response.resourcePath',
      type: 'text',
      label: 'Path to records in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
    'http.successPathUpdate': {
      id: 'http.successPathUpdate',
      helpKey: 'import.http.response.successPath',
      type: 'text',
      label: 'Path to success field in HTTP response body',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (
            Array.isArray(
              r && r.http && r.http.response && r.http.response.successPath
            )
          ) {
            return r.http.response.successPath[0];
          }

          return r && r.http && r.http.response && r.http.response.successPath;
        }

        return '';
      },
    },
    'http.successValuesUpdate': {
      id: 'http.successValuesUpdate',
      helpKey: 'import.http.response.successValues',
      type: 'text',
      label: 'Success values',
      delimiter: ',',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (
            Array.isArray(
              r &&
                r.http &&
                r.http.response &&
                r.http.response.successValues &&
                r.http.response.successValues[0]
            )
          ) {
            return r.http.response.successValues[0];
          }

          return (
            r && r.http && r.http.response && r.http.response.successValues
          );
        }

        return '';
      },
    },
    'http.existingLookupType': {
      fieldId: 'http.existingLookupType',
    },
    'http.ignoreExistingExtract': {
      fieldId: 'http.ignoreExistingExtract',
    },
    'http.ignoreExistingLookupName': {
      fieldId: 'http.ignoreExistingLookupName',
    },
    'http.newLookupType': {
      fieldId: 'http.newLookupType',
    },
    'http.ignoreNewExtract': {
      fieldId: 'http.ignoreNewExtract',
    },
    'http.ignoreNewLookupName': {
      fieldId: 'http.ignoreNewLookupName',
    },
    'http.lookupType': {
      fieldId: 'http.lookupType',
    },
    'http.existingExtract': {
      fieldId: 'http.existingExtract',
    },
    'http.existingLookupName': {
      fieldId: 'http.existingLookupName',
    },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    graphql: {
      formId: 'graphql',
      visibleWhenAll: [
        {
          field: 'http.method',
          isNot: ['COMPOSITE'],
        },
      ],
    },
    graphqlCreate: {
      formId: 'graphqlCreate',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
    graphqlUpdate: {
      formId: 'graphqlUpdate',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
    mockResponseSection: {formId: 'mockResponseSection'},
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'inputMode', 'dataMappings', 'formView'],
      },
      {
        collapsed: true,
        label: 'How would you like the records imported?',
        fields: [
          'http.method',
          'http.lookups',
          'graphql',
          'http.compositeType',
        ],
        containers: [
          {type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'Create new records',
                fields: [
                  'http.compositeMethodCreate',
                  'graphqlCreate',
                ],
              },
              {
                collapsed: true,
                label: 'Identify existing records',
                fields: ['http.existingLookupType', 'http.ignoreExistingExtract', 'http.ignoreExistingLookupName'],
              },
              {
                collapsed: true,
                label: 'Identify existing records',
                fields: ['http.newLookupType', 'http.ignoreNewExtract', 'http.ignoreNewLookupName'],
              },
              {
                collapsed: true,
                label: 'Identify existing records',
                fields: ['http.lookupType', 'http.existingExtract', 'http.existingLookupName'],
              },
              {
                collapsed: true,
                label: 'Update existing records',
                fields: [
                  'http.compositeMethodUpdate',
                  'graphqlUpdate',
                ],
              },
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        containers: [
          {
            type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'Create new records',
                fields: [
                  'http.resourcePathCreate',
                  'http.resourceIdPathCreate',
                  'http.failPathCreate',
                  'http.failValuesCreate',
                  'http.successPathCreate',
                  'http.successValuesCreate',
                ],
              },
              {
                collapsed: true,
                label: 'Update existing records',
                fields: [
                  'http.resourcePathUpdate',
                  'http.resourceIdPathUpdate',
                  'http.failPathUpdate',
                  'http.failValuesUpdate',
                  'http.successPathUpdate',
                  'http.successValuesUpdate',
                ],
              },
            ],
          },
          {
            fields: [
              'http.response.resourceIdPath',
            ],
          },
        ],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
