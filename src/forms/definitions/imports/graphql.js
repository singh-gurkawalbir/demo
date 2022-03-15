import { convertGraphQLQueryToHTTPBody, getGraphQLValues } from '../../../utils/graphql';

/* eslint-disable no-param-reassign */
export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    // graphql specific values
    retValues['/http/formType'] = 'graph_ql';

    // relative URI
    retValues['/http/relativeURI'] = '/';
    retValues['/http/relativeURIUpdate'] = '/';
    retValues['/http/relativeURICreate'] = '/';

    // http.body
    if (!retValues['/http/body']) {
      retValues['/http/body'] = convertGraphQLQueryToHTTPBody({
        query: retValues['/graphql/query'],
        variables: retValues['/graphql/variables'],
        operationName: retValues['/graphql/operationName'],
      });
    }
    // http.bodyCreate
    if (!retValues['/http/bodyCreate']) {
      retValues['/http/bodyCreate'] = convertGraphQLQueryToHTTPBody({
        query: retValues['/graphql/queryCreate'],
        variables: retValues['/graphql/variablesCreate'],
        operationName: retValues['/graphql/operationNameCreate'],
      });
    }
    // http.bodyUpdate
    if (!retValues['/http/bodyUpdate']) {
      retValues['/http/bodyUpdate'] = convertGraphQLQueryToHTTPBody({
        query: retValues['/graphql/queryUpdate'],
        variables: retValues['/graphql/variablesUpdate'],
        operationName: retValues['/graphql/operationNameUpdate'],
      });
    }

    delete retValues['/graphql/query'];
    delete retValues['/graphql/variables'];
    delete retValues['/graphql/operationName'];

    delete retValues['/graphql/queryCreate'];
    delete retValues['/graphql/variablesCreate'];
    delete retValues['/graphql/operationNameCreate'];

    delete retValues['/graphql/queryUpdate'];
    delete retValues['/graphql/variablesUpdate'];
    delete retValues['/graphql/operationNameUpdate'];
    // graphql specific values end

    if (retValues['/http/response/successValues']) {
      retValues['/http/response/successValues'] = [
        retValues['/http/response/successValues'],
      ];
    }

    if (retValues['/http/response/failValues']) {
      retValues['/http/response/failValues'] = [
        retValues['/http/response/failValues'],
      ];
    }

    if (retValues['/http/method'] === 'COMPOSITE') {
      if (retValues['/http/compositeType'] === 'createandupdate') {
        retValues['/http/relativeURI'] = [
          retValues['/http/relativeURIUpdate'],
          retValues['/http/relativeURICreate'],
        ];
        retValues['/http/requestType'] = ['UPDATE', 'CREATE'];
        retValues['/http/method'] = [
          retValues['/http/compositeMethodUpdate'],
          retValues['/http/compositeMethodCreate'],
        ];

        retValues['/http/resourceId'] = undefined;
        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;

        if (
          retValues['/http/resourceIdPathCreate'] ||
          retValues['/http/resourceIdPathUpdate']
        ) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/resourceIdPathUpdate'],
            retValues['/http/resourceIdPathCreate'],
          ];
        } else {
          retValues['/http/response/resourceIdPath'] = undefined;
        }

        if (
          retValues['/http/resourcePathCreate'] ||
          retValues['/http/resourcePathUpdate']
        ) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathUpdate'],
            retValues['/http/resourcePathCreate'],
          ];
        } else {
          retValues['/http/response/resourcePath'] = undefined;
        }

        if (
          retValues['/http/successPathCreate'] ||
          retValues['/http/successPathUpdate']
        ) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathUpdate'],
            retValues['/http/successPathCreate'],
          ];
        } else {
          retValues['/http/response/successPath'] = undefined;
        }

        if (
          retValues['/http/successValuesCreate'] ||
          retValues['/http/successValuesUpdate']
        ) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesUpdate'],
            retValues['/http/successValuesCreate'],
          ];
        } else {
          retValues['/http/response/successValues'] = undefined;
        }

        if (
          retValues['/http/failPathCreate'] ||
          retValues['/http/failPathUpdate']
        ) {
          retValues['/http/response/failPath'] = [
            retValues['/http/failPathUpdate'],
            retValues['/http/failPathCreate'],
          ];
        } else {
          retValues['/http/response/failPath'] = undefined;
        }

        if (
          retValues['/http/failValuesCreate'] ||
          retValues['/http/failValuesUpdate']
        ) {
          retValues['/http/response/failValues'] = [
            retValues['/http/failValuesUpdate'],
            retValues['/http/failValuesCreate'],
          ];
        } else {
          retValues['/http/response/failValues'] = undefined;
        }

        retValues['/http/body'] = [
          retValues['/http/bodyUpdate'],
          retValues['/http/bodyCreate'],
        ];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = false;

        if (retValues['/http/existingLookupName']) {
          retValues['/http/existingExtract'] = undefined;
        } else if (retValues['/http/existingExtract']) {
          retValues['/http/existingLookupName'] = undefined;
        } else {
          retValues['/http/existingLookupName'] = undefined;
          retValues['/http/existingExtract'] = undefined;
        }
      } else if (retValues['/http/compositeType'] === 'createandignore') {
        retValues['/http/relativeURI'] = [retValues['/http/relativeURICreate']];
        retValues['/http/method'] = [retValues['/http/compositeMethodCreate']];

        retValues['/http/resourceId'] = undefined;
        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;
        retValues['/http/existingLookupName'] = undefined; // for create and update composite type
        retValues['/http/existingExtract'] = undefined;

        if (retValues['/http/resourceIdPathCreate']) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/resourceIdPathCreate'],
          ];
        } else {
          retValues['/http/response/resourceIdPath'] = undefined;
        }

        if (retValues['/http/resourcePathCreate']) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathCreate'],
          ];
        } else {
          retValues['/http/response/resourcePath'] = undefined;
        }

        if (retValues['/http/successPathCreate']) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathCreate'],
          ];
        } else {
          retValues['/http/response/successPath'] = undefined;
        }

        if (retValues['/http/failPathCreate']) {
          retValues['/http/response/failPath'] = [
            retValues['/http/failPathCreate'],
          ];
        } else {
          retValues['/http/response/failPath'] = undefined;
        }

        if (retValues['/http/successValuesCreate']) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesCreate'],
          ];
        } else {
          retValues['/http/response/successValues'] = undefined;
        }

        if (retValues['/http/failValuesCreate']) {
          retValues['/http/response/failValues'] = [
            retValues['/http/failValuesCreate'],
          ];
        } else {
          retValues['/http/response/failValues'] = undefined;
        }

        retValues['/http/body'] = [retValues['/http/bodyCreate']];

        retValues['/ignoreExisting'] = true;
        retValues['/ignoreMissing'] = false;

        if (retValues['/http/ignoreExistingLookupName']) {
          retValues['/http/ignoreExtract'] = undefined;
          retValues['/http/ignoreLookupName'] = retValues['/http/ignoreExistingLookupName'];
        } else if (retValues['/http/ignoreExistingExtract']) {
          retValues['/http/ignoreLookupName'] = undefined;
          retValues['/http/ignoreExtract'] = retValues['/http/ignoreExistingExtract'];
        } else {
          retValues['/http/ignoreLookupName'] = undefined;
          retValues['/http/ignoreExtract'] = undefined;
        }

        retValues['/http/existingDataId'] = undefined;
      } else if (retValues['/http/compositeType'] === 'updateandignore') {
        retValues['/http/relativeURI'] = [retValues['/http/relativeURIUpdate']];
        retValues['/http/method'] = [retValues['/http/compositeMethodUpdate']];

        retValues['/http/resourceId'] = undefined;
        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;
        retValues['/http/existingLookupName'] = undefined; // for create and update composite type
        retValues['/http/existingExtract'] = undefined;

        if (retValues['/http/resourceIdPathUpdate']) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/resourceIdPathUpdate'],
          ];
        } else {
          retValues['/http/response/resourceIdPath'] = undefined;
        }

        if (retValues['/http/resourcePathUpdate']) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathUpdate'],
          ];
        } else {
          retValues['/http/response/resourcePath'] = undefined;
        }

        if (retValues['/http/successPathUpdate']) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathUpdate'],
          ];
        } else {
          retValues['/http/response/successPath'] = undefined;
        }

        if (retValues['/http/failPathUpdate']) {
          retValues['/http/response/failPath'] = [
            retValues['/http/failPathUpdate'],
          ];
        } else {
          retValues['/http/response/failPath'] = undefined;
        }

        if (retValues['/http/failValuesUpdate']) {
          retValues['/http/response/failValues'] = [
            retValues['/http/failValuesUpdate'],
          ];
        } else {
          retValues['/http/response/failValues'] = undefined;
        }

        if (retValues['/http/successValuesUpdate']) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesUpdate'],
          ];
        } else {
          retValues['/http/response/successValues'] = undefined;
        }

        retValues['/http/body'] = [retValues['/http/bodyUpdate']];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = true;

        if (retValues['/http/ignoreNewLookupName']) {
          retValues['/http/ignoreExtract'] = undefined;
          retValues['/http/ignoreLookupName'] = retValues['/http/ignoreNewLookupName'];
        } else if (retValues['/http/ignoreNewExtract']) {
          retValues['/http/ignoreLookupName'] = undefined;
          retValues['/http/ignoreExtract'] = retValues['/http/ignoreNewExtract'];
        } else {
          retValues['/http/ignoreLookupName'] = undefined;
          retValues['/http/ignoreExtract'] = undefined;
        }

        retValues['/http/existingDataId'] = undefined;
        retValues['/http/update/existingDataId'] = undefined;
      }
    } else {
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
      retValues['/http/body'] = retValues['/http/body']
        ? [retValues['/http/body']]
        : [];
      retValues['/http/ignoreLookupName'] = undefined;
      retValues['/http/ignoreExtract'] = undefined;
      retValues['/http/existingLookupName'] = undefined; // for create and update composite type
      retValues['/http/existingExtract'] = undefined;
      retValues['/http/existingDataId'] = undefined;
      retValues['/http/update/existingDataId'] = undefined;
    }

    if (retValues['/inputMode'] !== 'blob') {
      delete retValues['/blobKeyPath'];
      delete retValues['/blob'];
    } else {
      retValues['/blob'] = true;
    }
    if (!retValues['/http/successMediaType']) {
      retValues['/http/successMediaType'] = undefined;
    }
    if (!retValues['/http/errorMediaType']) {
      retValues['/http/errorMediaType'] = undefined;
    }
    retValues['/statusExport'] = undefined;
    delete retValues['/inputMode'];
    delete retValues['/http/existingLookupType'];
    delete retValues['/http/newLookupType'];
    delete retValues['/http/lookupType'];
    delete retValues['/http/ignoreExistingExtract'];
    delete retValues['/http/ignoreNewExtract'];
    delete retValues['/http/ignoreExistingLookupName'];
    delete retValues['/http/ignoreNewLookupName'];

    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }

    return {
      ...retValues,
    };
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
    'http.successMediaType': {
      fieldId: 'http.successMediaType',
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
    'http.errorMediaType': {
      fieldId: 'http.errorMediaType',
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
    'graphql.queryCreate': {
      id: 'graphql.queryCreate',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
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
            return getGraphQLValues({resource: r, field: 'query', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'query', path: 'http.body[0]'}) || '';
        }

        return '';
      },
    },
    'graphql.operationNameCreate': {
      id: 'graphql.operationNameCreate',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
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
            return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[0]'}) || '';
        }

        return '';
      },
    },
    'graphql.variablesCreate': {
      id: 'graphql.variablesCreate',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
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
            return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[0]'}) || '';
        }

        return '';
      },
    },
    'graphql.queryUpdate': {
      id: 'graphql.queryUpdate',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
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
          return getGraphQLValues({resource: r, field: 'query', path: 'http.body[0]'}) || '';
        }

        return '';
      },
    },
    'graphql.operationNameUpdate': {
      id: 'graphql.operationNameUpdate',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
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
          return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[0]'}) || '';
        }

        return '';
      },

    },
    'graphql.variablesUpdate': {
      id: 'graphql.variablesUpdate',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
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
          return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[0]'}) || '';
        }

        return '';
      },
    },
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
                  'graphql.queryCreate',
                  'graphql.operationNameCreate',
                  'graphql.variablesCreate',
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
                  'graphql.queryUpdate',
                  'graphql.operationNameUpdate',
                  'graphql.variablesUpdate',
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
              // 'http.successMediaType',
              // 'http.errorMediaType',
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};
