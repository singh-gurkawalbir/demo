import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const lookups = retValues['/http/lookups'];
    const lookup =
      lookups &&
      lookups.find(l => l.name === retValues['/http/existingDataId']);

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

    if (retValues['/inputMode'] === 'blob') {
      retValues['/http/method'] = retValues['/http/blobMethod'];
    } else if (retValues['/http/method'] === 'COMPOSITE') {
      if (retValues['/http/compositeType'] === 'createandupdate') {
        retValues['/http/relativeURI'] = [
          retValues['/http/relativeURIUpdate'],
          retValues['/http/relativeURICreate'],
        ];
        retValues['/http/requestType'] = [
          retValues['/http/requestTypeUpdate'],
          retValues['/http/requestTypeCreate'],
        ];
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
      } else if (retValues['/http/compositeType'] === 'createandignore') {
        retValues['/http/relativeURI'] = [retValues['/http/relativeURICreate']];
        retValues['/http/method'] = [retValues['/http/compositeMethodCreate']];

        retValues['/http/resourceId'] = undefined;
        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;

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

        if (lookup) {
          retValues['/http/ignoreLookupName'] =
            retValues['/http/existingDataId'];
          retValues['/http/ignoreExtract'] = null;
        } else {
          retValues['/http/ignoreExtract'] = retValues['/http/existingDataId'];
          retValues['/http/ignoreLookupName'] = null;
        }

        retValues['/http/existingDataId'] = undefined;
      } else if (retValues['/http/compositeType'] === 'updateandignore') {
        retValues['/http/relativeURI'] = [retValues['/http/relativeURIUpdate']];
        retValues['/http/method'] = [retValues['/http/compositeMethodUpdate']];

        retValues['/http/resourceId'] = undefined;
        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;

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

        if (lookup) {
          retValues['/http/ignoreLookupName'] =
            retValues['/http/existingDataId'];
          retValues['/http/ignoreExtract'] = null;
        } else {
          retValues['/http/ignoreExtract'] = retValues['/http/existingDataId'];
          retValues['/http/ignoreLookupName'] = null;
        }

        retValues['/http/existingDataId'] = undefined;
      }
    } else {
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
      retValues['/http/body'] = retValues['/http/body']
        ? [retValues['/http/body']]
        : [];
      retValues['/http/ignoreLookupName'] = undefined;
      retValues['/http/ignoreExtract'] = undefined;
      retValues['/http/existingDataId'] = undefined;
    }

    retValues['/statusExport'] = undefined;
    delete retValues['/inputMode'];

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
      bodyFields.forEach(field => {
        const f = field;

        if (f && f.requestMediaType !== requestMediaTypeField.value) {
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
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: r => {
        if (r.resourceType === 'transferFiles' || r.blobKeyPath) {
          return 'How would you like the files transfered?';
        }

        return 'How would you like the records imported?';
      },
    },
    dataMappings: { formId: 'dataMappings' },
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
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => {
        if (r.resourceType === 'importRecords') return 'records';

        if (r.resourceType === 'transferFiles') return 'blob';

        return r && r.blobKeyPath ? 'blob' : 'records';
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
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create new data',
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
    'http.compositeMethodCreate': {
      id: 'http.compositeMethodCreate',
      type: 'select',
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
      type: 'relativeuri',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
      placeholder: 'Optional',
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
    'http.requestTypeCreate': {
      id: 'http.requestTypeCreate',
      type: 'select',
      label: 'RequestType',
      helpKey: 'http.import.http.requestTypeCreate',
      required: true,
      options: [
        {
          items: [
            { label: 'CREATE', value: 'CREATE' },
            { label: 'UPDATE', value: 'UPDATE' },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate'],
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
            return r.http.requestType[1];
          }

          return r.http.requestType[0];
        }

        return '';
      },
    },
    'http.bodyCreate': {
      id: 'http.bodyCreate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP request body for create',
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
            return r.http.body[1];
          }

          return r.http.body[0];
        }

        return '';
      },
    },
    'http.failPathCreate': {
      id: 'http.failPathCreate',
      type: 'text',
      label: 'Fail path',
      placeholder: 'Optional',
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
      type: 'text',
      label: 'Fail values',
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
      type: 'text',
      label: 'Fail path',
      placeholder: 'Optional',
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
      type: 'text',
      label: 'Fail values',
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
      type: 'text',
      label: 'Response ID path',
      placeholder: 'Optional',
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
      type: 'text',
      label: 'Response path',
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
      type: 'text',
      label: 'Success path',
      placeholder: 'Optional',
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
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Update existing data',
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
    'http.compositeMethodUpdate': {
      id: 'http.compositeMethodUpdate',
      type: 'select',
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
      type: 'relativeuri',
      arrayIndex: 0,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
      placeholder: 'Optional',
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
    'http.requestTypeUpdate': {
      id: 'http.requestTypeUpdate',
      type: 'select',
      label: 'Request type',
      helpKey: 'http.import.http.requestTypeUpdate',
      required: true,
      options: [
        {
          items: [
            { label: 'CREATE', value: 'CREATE' },
            { label: 'UPDATE', value: 'UPDATE' },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate'],
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
          return r.http.requestType && r.http.requestType[0];
        }

        return '';
      },
    },
    'http.bodyUpdate': {
      id: 'http.bodyUpdate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP request body for update',
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
          return r.http.body[0];
        }

        return '';
      },
    },
    'http.resourceIdPathUpdate': {
      id: 'http.resourceIdPathUpdate',
      type: 'text',
      label: 'Response ID path',
      placeholder: 'Optional',
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
      type: 'text',
      label: 'Response path',
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
      type: 'text',
      label: 'Success path',
      placeholder: 'Optional',
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
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore existing data',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandignore'],
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
    ignoreNewData: {
      id: 'ignoreNewData',
      type: 'labeltitle',
      label: 'Ignore new data',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['updateandignore'],
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
    'http.existingDataId': {
      id: 'http.existingDataId',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
      label: 'Existing data ID',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandignore', 'updateandignore'],
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
      requiredWhen: [
        {
          field: 'http.compositeType',
          is: ['createandignore', 'updateandignore'],
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
    mediatypeInformation: {
      id: 'mediatypeInformation',
      type: 'labeltitle',
      label: 'Media type information',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    uploadFile: {
      id: 'uploadFile',
      type: 'uploadfile',
      label: 'Sample file (that would be imported)',
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
    'file.csv.customHeaderRows': {
      id: 'file.csv.customHeaderRows',
      label: 'Custom header rows',
      type: 'textarea',
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
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
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
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'dataMappings',
      'blobKeyPath',
      'http.method',
      'http.blobMethod',
      'http.headers',
      'http.requestMediaType',
      'http.compositeType',
      'http.lookups',
      'http.relativeURI',
      'http.body',
      'http.response.successPath',
      'http.response.successValues',
      'http.response.failPath',
      'http.response.failValues',
      'http.response.resourceIdPath',
      'http.response.resourcePath',
      'http.response.errorPath',
      'http.batchSize',
      'createNewData',
      'http.compositeMethodCreate',
      'http.relativeURICreate',
      'http.requestTypeCreate',
      'http.bodyCreate',
      'http.successPathCreate',
      'http.successValuesCreate',
      'http.failPathCreate',
      'http.failValuesCreate',
      'http.resourceIdPathCreate',
      'http.resourcePathCreate',
      'upateExistingData',
      'http.compositeMethodUpdate',
      'http.relativeURIUpdate',
      'http.requestTypeUpdate',
      'http.bodyUpdate',
      'http.successPathUpdate',
      'http.successValuesUpdate',
      'http.failPathUpdate',
      'http.failValuesUpdate',
      'http.resourceIdPathUpdate',
      'http.resourcePathUpdate',
      'ignoreExistingData',
      'ignoreNewData',
      'http.existingDataId',
      'mediatypeInformation',
      'http.successMediaType',
      'http.errorMediaType',
      'uploadFile',
      'file.csv',
      'file.csv.customHeaderRows',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'http.ignoreEmptyNodes',
          'advancedSettings',
          'http.configureAsyncHelper',
          'http._asyncHelperId',
          'deleteAfterImport',
        ],
      },
    ],
  },
};
