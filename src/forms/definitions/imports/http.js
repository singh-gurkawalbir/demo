import { HTTP_IMPORT_CREATE_FEED_RELATIVE_URI } from '../../../constants';
import { safeParse } from '../../../utils/string';

/* eslint-disable no-param-reassign */
export default {
  preSave: (formValues, _, { connection } = {}) => {
    const retValues = { ...formValues };

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

    // delete feed related fields if method and relative uri are not for feed document
    if (retValues['/http/method'] !== 'POST' || retValues['/http/relativeURI'] !== HTTP_IMPORT_CREATE_FEED_RELATIVE_URI) {
      retValues['/unencrypted/feedType'] = undefined;
      retValues['/unencrypted/feedOptions'] = undefined;
    } else {
      retValues['/unencrypted/feedOptions'] = safeParse(
        retValues['/unencrypted/feedOptions']
      );
    }
    // if field value is empty string, make it undefined
    if (!retValues['/unencrypted/feedType']) { retValues['/unencrypted/feedType'] = undefined; }
    if (!retValues['/unencrypted/feedOptions']) { retValues['/unencrypted/feedOptions'] = undefined; }

    if (retValues['/inputMode'] === 'blob') {
      retValues['/http/method'] = retValues['/http/blobMethod'];
    } else if (retValues['/http/method'] === 'COMPOSITE') {
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
    if (retValues['/http/requestMediaType'] === 'csv') {
      retValues['/file/type'] = 'csv';
    }
    if (!retValues['/http/requestMediaType']) {
      retValues['/http/requestMediaType'] = undefined;
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

    if (connection?.http?.type === 'Amazon-SP-API') {
      retValues['/unencrypted/apiType'] = 'Amazon-SP-API';
    }

    if (!retValues['/http/configureAsyncHelper']) {
      retValues['/http/_asyncHelperId'] = undefined;
    }
    retValues['/adaptorType'] = 'HTTPImport';
    retValues['/mockResponse'] = safeParse(retValues['/mockResponse']);

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'http.body' ||
      fieldId === 'http.bodyCreate' ||
      fieldId === 'http.bodyUpdate'
    ) {
      const httpBodyField = fields.find(field => field.fieldId === 'http.body');
      const httpBodyCreateField = fields.find(
        field => field.fieldId === 'http.bodyCreate'
      );
      const httpBodyUpdateField = fields.find(
        field => field.fieldId === 'http.bodyUpdate'
      );
      const requestMediaTypeField = fields.find(
        field => field.fieldId === 'http.requestMediaType'
      );
      const bodyFields = [
        httpBodyField,
        httpBodyCreateField,
        httpBodyUpdateField,
      ];

      // checking if requestMediaType value changed. Reset body value when requestMediaType changes. Also, store requestMediaType value to check for change
      bodyFields.forEach(f => {
        if (!f) return;
        if (f.requestMediaType && requestMediaTypeField.value && f.requestMediaType !== requestMediaTypeField.value) {
          f.value = '';
          f.requestMediaType = requestMediaTypeField.value;
        }
      });

      return {
        contentType: requestMediaTypeField.value,
      };
    }

    return null;
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
    'http.blobMethod': { fieldId: 'http.blobMethod' },
    'http.headers': { fieldId: 'http.headers' },
    'http.response.failPath': {
      fieldId: 'http.response.failPath',
      defaultValue: r => {
        if (
          Array.isArray(
            r && r.http && r.http.response && r.http.response.failPath
          )
        ) {
          return r.http.response.failPath[0];
        }

        return r && r.http && r.http.response && r.http.response.failPath;
      },
    },
    'http.response.failValues': {
      fieldId: 'http.response.failValues',
      defaultValue: r => {
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
      },
    },
    'http.requestMediaType': { fieldId: 'http.requestMediaType' },
    'http.compositeType': { fieldId: 'http.compositeType' },
    'http.lookups': { fieldId: 'http.lookups', visible: false },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.response.successPath': {
      fieldId: 'http.response.successPath',
      defaultValue: r => {
        if (
          Array.isArray(
            r && r.http && r.http.response && r.http.response.successPath
          )
        ) {
          return r.http.response.successPath[0];
        }

        return r && r.http && r.http.response && r.http.response.successPath;
      },
    },
    'http.response.successValues': {
      fieldId: 'http.response.successValues',
      defaultValue: r => {
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

        return r && r.http && r.http.response && r.http.response.successValues;
      },
    },
    'http.response.resourceIdPath': { fieldId: 'http.response.resourceIdPath' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    'http.batchSize': { fieldId: 'http.batchSize' },
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
    'http.relativeURICreate': {
      id: 'http.relativeURICreate',
      helpKey: 'import.http.relativeURI',
      type: 'relativeuri',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
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
            return r.http.relativeURI[1];
          }

          return r.http.relativeURI[0];
        }

        return '';
      },
    },
    'http.bodyCreate': {
      id: 'http.bodyCreate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      helpKey: 'import.http.body',
      arrayIndex: 1,
      requestMediaType: r =>
        r && r.http ? r && r.http.requestMediaType : 'json',
      refreshOptionsOnChangesTo: ['http.requestMediaType'],
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
            return r.http.body?.[1] || '';
          }

          return r.http.body?.[0] || '';
        }

        return '';
      },
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
    'http.relativeURIUpdate': {
      id: 'http.relativeURIUpdate',
      helpKey: 'import.http.relativeURI',
      type: 'relativeuri',
      arrayIndex: 0,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
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
          return r.http.relativeURI && r.http.relativeURI[0];
        }

        return '';
      },
    },
    'http.bodyUpdate': {
      id: 'http.bodyUpdate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      helpKey: 'import.http.body',
      arrayIndex: 0,
      requestMediaType: r =>
        r && r.http ? r && r.http.requestMediaType : 'json',
      refreshOptionsOnChangesTo: ['http.requestMediaType'],
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
          return r.http.body?.[0] || '';
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
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
      placeholder: 'Sample file (that would be generated)',
      helpKey: 'import.uploadFile',
      mode: r => r && r.file && r.file.type,
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv': {
      fieldId: 'file.csv',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'http.body': {
      fieldId: 'http.body',
      refreshOptionsOnChangesTo: ['http.requestMediaType'],
    },

    'http.ignoreEmptyNodes': { fieldId: 'http.ignoreEmptyNodes' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    'http.configureAsyncHelper': { fieldId: 'http.configureAsyncHelper' },
    'http._asyncHelperId': { fieldId: 'http._asyncHelperId' },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
        },
      ],
    },
    'unencrypted.apiType': {fieldId: 'unencrypted.apiType'},
    'unencrypted.feedType': {fieldId: 'unencrypted.feedType'},
    'unencrypted.feedOptions': {fieldId: 'unencrypted.feedOptions'},
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
        label: r => {
          if (r?.resourceType === 'transferFiles' || r?.blob) {
            return 'Where would you like the files transferred?';
          }

          return 'How would you like the records imported?';
        },
        fields: [
          'unencrypted.apiType',
          'http.method',
          'http.blobMethod',
          'http.compositeType',
          'http.relativeURI',
          'http.headers',
          'http.requestMediaType',
          'http.lookups',
          'http.batchSize',
          'unencrypted.feedType',
          'unencrypted.feedOptions',
          'http.body',
          'uploadFile',
        ],
        containers: [
          {type: 'indent',
            containers: [
              {
                fields:
                [
                  'file.csv',
                ],
              },
            ],
          },
          {type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'Create new records',
                fields: [
                  'http.compositeMethodCreate',
                  'http.relativeURICreate',
                  'http.bodyCreate',
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
                  'http.relativeURIUpdate',
                  'http.bodyUpdate',
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
              'http.response.resourcePath',
              'http.response.resourceIdPath',
              'http.response.failPath',
              'http.response.failValues',
              'http.response.successPath',
              'http.response.successValues',
              'http.response.errorPath',
              'http.successMediaType',
              'http.errorMediaType',
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
        fields: [
          'http.ignoreEmptyNodes',
          'blobKeyPath',
          'advancedSettings',
          'http.configureAsyncHelper',
          'http._asyncHelperId',
          'deleteAfterImport',
        ],
      },
    ],
  },
};
