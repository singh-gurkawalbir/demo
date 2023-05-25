import { getMediaTypeForImport, isNewId } from '../../../utils/resource';
import { isJsonString, safeParse } from '../../../utils/string';

function isValidArray(value) {
  if (Array.isArray(value) && value[0]) {
    return true;
  }

  return false;
}
const restPreSave = formValues => {
  const retValues = { ...formValues };
  const restToHttpFieldMap = {
    '/rest/lookups': '/http/lookups',
    '/rest/existingDataId': '/http/existingDataId',
    '/rest/update/existingDataId': '/http/update/existingDataId',
    '/rest/method': '/http/method',
    '/rest/blobMethod': '/http/blobMethod',
    '/rest/successPath': '/http/response/successPath',
    '/rest/successValues': '/http/response/successValues',
    '/rest/compositeType': '/http/compositeType',
    '/rest/relativeURI': '/http/relativeURI',
    '/rest/relativeURIUpdate': '/http/relativeURIUpdate',
    '/rest/relativeURICreate': '/http/relativeURICreate',
    '/rest/requestType': '/http/requestType',
    '/rest/compositeMethodUpdate': '/http/compositeMethodUpdate',
    '/rest/compositeMethodCreate': '/http/compositeMethodCreate',
    '/rest/existingLookupName': '/http/existingLookupName',
    '/rest/existingExtract': '/http/existingExtract',
    '/rest/responseIdPathCreate': '/http/responseIdPathCreate',
    '/rest/responseIdPathUpdate': '/http/responseIdPathUpdate',
    '/rest/responseIdPath': '/http/response/resourceIdPath',
    '/rest/successPathUpdate': '/http/successPathUpdate',
    '/rest/successPathCreate': '/http/successPathCreate',
    '/rest/successValuesCreate': '/http/successValuesCreate',
    '/rest/successValuesUpdate': '/http/successValuesUpdate',
    '/rest/body': '/http/body',
    '/rest/bodyUpdate': '/http/bodyUpdate',
    '/rest/bodyCreate': '/http/bodyCreate',
    '/rest/existingLookupType': '/http/existingLookupType',
    '/rest/newLookupType': '/http/newLookupType',
    '/rest/ignoreExistingExtract': '/http/ignoreExistingExtract',
    '/rest/ignoreNewExtract': '/http/ignoreNewExtract',
    '/rest/ignoreExistingLookupName': '/http/ignoreExistingLookupName',
    '/rest/ignoreNewLookupName': '/http/ignoreNewLookupName',
    '/rest/lookupType': '/http/lookupType',
    '/rest/headers': '/http/headers',
  };

  Object.keys(restToHttpFieldMap).forEach(restField => {
    const httpField = restToHttpFieldMap[restField];

    if (retValues[httpField]) {
      retValues[restField] = retValues[httpField];
    } else {
      retValues[restField] = undefined;
    }
    delete retValues[httpField];
  });
  const sampleData = retValues['/sampleData'];

  if (sampleData === '') {
    retValues['/sampleData'] = undefined;
  } else {
    // Save sampleData in JSON format with a fail safe condition
    retValues['/sampleData'] = isJsonString(sampleData)
      ? JSON.parse(sampleData)
      : undefined;
  }

  if (retValues['/inputMode'] === 'blob') {
    retValues['/rest/method'] = retValues['/rest/blobMethod'];
  } else if (retValues['/rest/method'] === 'COMPOSITE') {
    retValues['/rest/successPath'] = undefined;
    retValues['/rest/successValues'] = undefined;

    if (retValues['/rest/compositeType'] === 'createandupdate') {
      retValues['/rest/relativeURI'] = [
        retValues['/rest/relativeURIUpdate'],
        retValues['/rest/relativeURICreate'],
      ];
      retValues['/rest/requestType'] = [
        'UPDATE',
        'CREATE',
      ];
      retValues['/rest/method'] = [
        retValues['/rest/compositeMethodUpdate'],
        retValues['/rest/compositeMethodCreate'],
      ];

      if (
        retValues['/rest/responseIdPathCreate'] ||
          retValues['/rest/responseIdPathUpdate']
      ) {
        retValues['/rest/responseIdPath'] = [
          retValues['/rest/responseIdPathUpdate'],
          retValues['/rest/responseIdPathCreate'],
        ];
      }

      if (
        retValues['/rest/successPathCreate'] ||
          retValues['/rest/successPathUpdate']
      ) {
        retValues['/rest/successPath'] = [
          retValues['/rest/successPathUpdate'],
          retValues['/rest/successPathCreate'],
        ];
      }

      if (
        retValues['/rest/successValuesCreate'] ||
          retValues['/rest/successValuesUpdate']
      ) {
        retValues['/rest/successValues'] = [
          retValues['/rest/successValuesUpdate'],
          retValues['/rest/successValuesCreate'],
        ];
      }

      retValues['/rest/body'] = [
        retValues['/rest/bodyUpdate'],
        retValues['/rest/bodyCreate'],
      ];

      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;

      if (retValues['/rest/existingLookupName']) {
        retValues['/rest/existingExtract'] = undefined;
      } else if (retValues['/rest/existingExtract']) {
        retValues['/rest/existingLookupName'] = undefined;
      } else {
        retValues['/rest/existingLookupName'] = undefined;
        retValues['/rest/existingExtract'] = undefined;
      }
    } else if (retValues['/rest/compositeType'] === 'createandignore') {
      retValues['/rest/relativeURI'] = [retValues['/rest/relativeURICreate']];
      retValues['/rest/method'] = [retValues['/rest/compositeMethodCreate']];

      retValues['/rest/ignoreLookupName'] = undefined;
      retValues['/rest/ignoreExtract'] = undefined;
      retValues['/rest/existingLookupName'] = undefined;
      retValues['/rest/existingExtract'] = undefined;

      if (retValues['/rest/responseIdPathCreate']) {
        retValues['/rest/responseIdPath'] = [
          retValues['/rest/responseIdPathCreate'],
        ];
      }

      if (retValues['/rest/bodyCreate']) retValues['/rest/body'] = [retValues['/rest/bodyCreate']];
      else {
        delete retValues['/rest/body'];
      }

      retValues['/ignoreExisting'] = true;
      retValues['/ignoreMissing'] = false;

      if (retValues['/rest/ignoreExistingLookupName']) {
        retValues['/rest/ignoreExtract'] = undefined;
        retValues['/rest/ignoreLookupName'] = retValues['/rest/ignoreExistingLookupName'];
      } else if (retValues['/rest/ignoreExistingExtract']) {
        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = retValues['/rest/ignoreExistingExtract'];
      } else {
        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;
      }

      retValues['/rest/existingDataId'] = undefined;

      if (retValues['/rest/successPathCreate']) {
        retValues['/rest/successPath'] = [
          retValues['/rest/successPathCreate'],
        ];
      }

      if (retValues['/rest/successValuesCreate']) {
        retValues['/rest/successValues'] = [
          retValues['/rest/successValuesCreate'],
        ];
      }
    } else if (retValues['/rest/compositeType'] === 'updateandignore') {
      retValues['/rest/relativeURI'] = [retValues['/rest/relativeURIUpdate']];
      retValues['/rest/method'] = [retValues['/rest/compositeMethodUpdate']];

      retValues['/rest/ignoreLookupName'] = undefined;
      retValues['/rest/ignoreExtract'] = undefined;
      retValues['/rest/existingLookupName'] = undefined;
      retValues['/rest/existingExtract'] = undefined;

      if (retValues['/rest/responseIdPathUpdate']) {
        retValues['/rest/responseIdPath'] = [
          retValues['/rest/responseIdPathUpdate'],
        ];
      }

      if (retValues['/rest/successPathUpdate']) {
        retValues['/rest/successPath'] = [
          retValues['/rest/successPathUpdate'],
        ];
      }

      if (retValues['/rest/successValuesUpdate']) {
        retValues['/rest/successValues'] = [
          retValues['/rest/successValuesUpdate'],
        ];
      }

      retValues['/rest/body'] = [retValues['/rest/bodyUpdate']];

      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = true;

      if (retValues['/rest/ignoreNewLookupName']) {
        retValues['/rest/ignoreExtract'] = undefined;
        retValues['/rest/ignoreLookupName'] = retValues['/rest/ignoreNewLookupName'];
      } else if (retValues['/rest/ignoreNewExtract']) {
        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = retValues['/rest/ignoreNewExtract'];
      } else {
        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;
      }

      retValues['/rest/update/existingDataId'] = undefined;
    }
  } else {
    retValues['/ignoreExisting'] = false;
    retValues['/ignoreMissing'] = false;
    retValues['/rest/body'] = retValues['/rest/body']
      ? [retValues['/rest/body']]
      : [];
    retValues['/rest/ignoreLookupName'] = undefined;
    retValues['/rest/ignoreExtract'] = undefined;
    retValues['/rest/existingLookupName'] = undefined;
    retValues['/rest/existingExtract'] = undefined;
    retValues['/rest/existingDataId'] = undefined;
    retValues['/rest/update/existingDataId'] = undefined;
  }

  if (retValues['/inputMode'] !== 'blob') {
    delete retValues['/blobKeyPath'];
    delete retValues['/blob'];
  } else {
    retValues['/blob'] = true;
  }

  delete retValues['/inputMode'];

  if (retValues['/oneToMany'] === 'false') {
    retValues['/pathToMany'] = undefined;
  }

  delete retValues['/rest/existingLookupType'];
  delete retValues['/rest/newLookupType'];
  delete retValues['/rest/lookupType'];
  delete retValues['/rest/ignoreExistingExtract'];
  delete retValues['/rest/ignoreNewExtract'];
  delete retValues['/rest/ignoreExistingLookupName'];
  delete retValues['/rest/ignoreNewLookupName'];
  retValues['/http'] = undefined;
  retValues['/mockResponse'] = safeParse(retValues['/mockResponse']);

  return {
    ...retValues,
  };
};

export default {
  preSave: (formValues, resource, options = {}) => {
    const { connection } = options;

    // For Edit cases, if resource was originally created as REST import or if connection has isHTTP as false, save it as REST import
    if ((resource?.adaptorType === 'RESTImport' && resource._id && !isNewId(resource._id)) ||
        (resource?.['/adaptorType'] === 'RESTImport' && resource['/_id'] && !isNewId(resource['/_id'])) ||
         connection?.isHTTP === false
    ) {
      return restPreSave(formValues);
    }
    const retValues = { ...formValues };
    const sampleData = retValues['/sampleData'];

    if (sampleData === '') {
      retValues['/sampleData'] = undefined;
    } else {
      // Save sampleData in JSON format with a fail safe condition
      retValues['/sampleData'] = isJsonString(sampleData)
        ? JSON.parse(sampleData)
        : undefined;
    }

    if (retValues['/inputMode'] === 'blob') {
      retValues['/http/method'] = retValues['/http/blobMethod'];
    } else if (retValues['/http/method'] === 'COMPOSITE') {
      retValues['/http/response/successPath'] = undefined;
      retValues['/http/response/successValues'] = undefined;

      if (retValues['/http/compositeType'] === 'createandupdate') {
        retValues['/http/relativeURI'] = [
          retValues['/http/relativeURIUpdate'],
          retValues['/http/relativeURICreate'],
        ];
        retValues['/http/requestType'] = [
          'UPDATE',
          'CREATE',
        ];
        retValues['/http/method'] = [
          retValues['/http/compositeMethodUpdate'],
          retValues['/http/compositeMethodCreate'],
        ];

        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;

        if (
          retValues['/http/responseIdPathCreate'] ||
          retValues['/http/responseIdPathUpdate']
        ) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/responseIdPathUpdate'],
            retValues['/http/responseIdPathCreate'],
          ];
        }

        if (
          retValues['/http/successPathCreate'] ||
          retValues['/http/successPathUpdate']
        ) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathUpdate'],
            retValues['/http/successPathCreate'],
          ];
        }

        if (
          retValues['/http/successValuesCreate'] ||
          retValues['/http/successValuesUpdate']
        ) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesUpdate'],
            retValues['/http/successValuesCreate'],
          ];
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

        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;
        retValues['/http/existingLookupName'] = undefined; // for create and update composite type
        retValues['/http/existingExtract'] = undefined;

        if (retValues['/http/responseIdPathCreate']) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/responseIdPathCreate'],
          ];
        }

        if (retValues['/http/bodyCreate']) retValues['/http/body'] = [retValues['/http/bodyCreate']];
        else {
          delete retValues['/http/body'];
        }

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

        if (retValues['/http/successPathCreate']) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathCreate'],
          ];
        }

        if (retValues['/http/successValuesCreate']) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesCreate'],
          ];
        }
      } else if (retValues['/http/compositeType'] === 'updateandignore') {
        retValues['/http/relativeURI'] = [retValues['/http/relativeURIUpdate']];
        retValues['/http/method'] = [retValues['/http/compositeMethodUpdate']];

        retValues['/http/ignoreLookupName'] = undefined;
        retValues['/http/ignoreExtract'] = undefined;
        retValues['/http/existingLookupName'] = undefined; // for create and update composite type
        retValues['/http/existingExtract'] = undefined;

        if (retValues['/http/responseIdPathUpdate']) {
          retValues['/http/response/resourceIdPath'] = [
            retValues['/http/responseIdPathUpdate'],
          ];
        }

        if (retValues['/http/successPathUpdate']) {
          retValues['/http/response/successPath'] = [
            retValues['/http/successPathUpdate'],
          ];
        }

        if (retValues['/http/successValuesUpdate']) {
          retValues['/http/response/successValues'] = [
            retValues['/http/successValuesUpdate'],
          ];
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

    delete retValues['/inputMode'];
    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }

    if (retValues['/oneToMany'] === 'false') {
      retValues['/pathToMany'] = undefined;
    }
    delete retValues['/http/existingLookupType'];
    delete retValues['/http/newLookupType'];
    delete retValues['/http/lookupType'];
    delete retValues['/http/ignoreExistingExtract'];
    delete retValues['/http/ignoreNewExtract'];
    delete retValues['/http/ignoreExistingLookupName'];
    delete retValues['/http/ignoreNewLookupName'];

    // #region begin
    // Following modifications are done to replicate the backend resttoHttp conversion util

    if (retValues['/http/response'] && isValidArray(retValues['/http/response/successPath']) && !isValidArray(retValues['/http/response/successValues'])) {
      retValues['/http/response/allowArrayForSuccessPath'] = true;
    }
    retValues['/adaptorType'] = 'HTTPImport';
    retValues['/http/requestMediaType'] = getMediaTypeForImport(connection, retValues['/http/headers']);
    retValues['/http/successMediaType'] = 'json';
    retValues['/http/errorMediaType'] = 'json';
    // #endregion

    // set formType to rest to identify that this http resource is created using REST form
    retValues['/http/formType'] = 'rest';

    return {
      ...retValues,
    };
  },
  validationHandler: field => {
    // Used to validate sampleData field
    // Incase of invalid json throws error to be shown on the field
    if (field && field.id === 'sampleData') {
      if (
        field.value &&
        typeof field.value === 'string' &&
        !isJsonString(field.value)
      ) return 'Sample Data must be a valid JSON';
    }
  },
  fieldMap: {
    common: { formId: 'common' },
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
    'http.compositeType': { fieldId: 'http.compositeType' },
    'http.lookups': { fieldId: 'http.lookups', visible: false },
    'http.relativeURI': { fieldId: 'http.relativeURI', required: true },
    'http.body': { fieldId: 'http.body' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'http.response.successValues': { fieldId: 'http.response.successValues' },
    'http.response.resourceIdPath': { fieldId: 'http.response.resourceIdPath' },
    'http.compositeMethodCreate': {
      id: 'http.compositeMethodCreate',
      helpKey: 'import.http.method',
      type: 'select',
      label: 'HTTP method',
      required: true,
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
      required: true,
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
            return r.http.relativeURI && r.http.relativeURI[1];
          }

          return r.http.relativeURI && r.http.relativeURI[0];
        }

        return '';
      },
    },
    'http.bodyCreate': {
      id: 'http.bodyCreate',
      type: 'httprequestbody',
      helpKey: 'import.http.body',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      refreshOptionsOnChangesTo: ['http.lookups'],
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
            return Array.isArray(r?.http?.body)
              ? r.http.body[1] || ''
              : undefined;
          }

          return Array.isArray(r?.http?.body)
            ? r.http.body[0] || ''
            : undefined;
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
            return r.http.response?.successPath && r.http.response?.successPath[1];
          }

          return r.http.response?.successPath && r.http.response?.successPath[0];
        }

        return '';
      },
    },
    'http.successValuesCreate': {
      id: 'http.successValuesCreate',
      helpKey: 'import.http.response.successValues',
      type: 'text',
      label: 'Success values',
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
            return r.http.response?.successValues && r.http.response?.successValues[1];
          }

          return r.http.response?.successValues && r.http.response?.successValues[0];
        }

        return '';
      },
    },
    'http.responseIdPathCreate': {
      id: 'http.responseIdPathCreate',
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
            return r.http.response?.resourceIdPath && r.http.response?.resourceIdPath[1];
          }

          return r.http.response?.resourceIdPath && r.http.response?.resourceIdPath[0];
        }

        return '';
      },
    },
    'http.compositeMethodUpdate': {
      id: 'http.compositeMethodUpdate',
      helpKey: 'import.http.method',
      type: 'select',
      label: 'HTTP method',
      required: true,
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
          return r.http.method[0];
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
      required: true,
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
      helpKey: 'import.http.body',
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      arrayIndex: 0,
      refreshOptionsOnChangesTo: ['http.lookups'],
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
          return Array.isArray(r?.http?.body)
            ? r.http?.body[0] || ''
            : undefined;
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
          return r.http.response?.successPath && r.http.response?.successPath[0];
        }

        return '';
      },
    },
    'http.successValuesUpdate': {
      id: 'http.successValuesUpdate',
      helpKey: 'import.http.response.successValues',
      type: 'text',
      label: 'Success values',
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
          return r.http.response?.successValues && r.http.response?.successValues[0];
        }

        return '';
      },
    },
    'http.responseIdPathUpdate': {
      id: 'http.responseIdPathUpdate',
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
          return r.http.response?.resourceIdPath && r.http.response?.resourceIdPath[0];
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
    sampleData: {
      fieldId: 'sampleData',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
        {
          field: 'http.method',
          isNot: ['DELETE'],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
        },
      ],
    },
    formView: { fieldId: 'formView' },
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
          'http.method',
          'http.blobMethod',
          'http.compositeType',
          'http.relativeURI',
          'http.headers',
          'http.lookups',
          'http.body',
        ],
        type: 'collapse',
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
      {
        collapsed: true,
        label: 'Do you have a sample destination record?',
        fields: ['sampleData'],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: [
          'http.response.resourceIdPath',
          'http.response.successPath',
          'http.response.successValues',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Create new records',
            fields: [
              'http.responseIdPathCreate',
              'http.successPathCreate',
              'http.successValuesCreate',
            ],
          },
          {
            collapsed: true,
            label: 'Update existing records',
            fields: [
              'http.responseIdPathUpdate',
              'http.successPathUpdate',
              'http.successValuesUpdate',
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
          'blobKeyPath', 'advancedSettings', 'deleteAfterImport'],
      },
    ],
  },
};
