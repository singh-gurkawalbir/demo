import { isJsonString } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const lookups = retValues['/rest/lookups'];
    const lookup =
      lookups &&
      lookups.find(
        l =>
          `${l.name}` === retValues['/rest/existingDataId'] ||
          `${l.name}` === retValues['/rest/update/existingDataId']
      );
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

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

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
      } else if (retValues['/rest/compositeType'] === 'createandignore') {
        retValues['/rest/relativeURI'] = [retValues['/rest/relativeURICreate']];
        retValues['/rest/method'] = [retValues['/rest/compositeMethodCreate']];

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

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

        if (lookup) {
          retValues['/rest/ignoreLookupName'] =
            retValues['/rest/existingDataId'];
          retValues['/rest/ignoreExtract'] = null;
        } else {
          retValues['/rest/ignoreExtract'] = retValues['/rest/existingDataId'];
          retValues['/rest/ignoreLookupName'] = null;
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

        if (lookup) {
          retValues['/rest/ignoreLookupName'] =
            retValues['/rest/update/existingDataId'];
          retValues['/rest/ignoreExtract'] = null;
        } else {
          retValues['/rest/ignoreExtract'] =
            retValues['/rest/update/existingDataId'];
          retValues['/rest/ignoreLookupName'] = null;
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
    'rest.method': { fieldId: 'rest.method' },
    'rest.blobMethod': { fieldId: 'rest.blobMethod' },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.compositeType': { fieldId: 'rest.compositeType' },
    'rest.lookups': { fieldId: 'rest.lookups', visible: false },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.body': { fieldId: 'rest.body' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    'rest.responseIdPath': { fieldId: 'rest.responseIdPath' },
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create new data',
      visibleWhenAll: [
        {
          field: 'rest.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'rest.compositeMethodCreate': {
      id: 'rest.compositeMethodCreate',
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
          is: ['createandupdate', 'createandignore'],
        },
        {
          field: 'rest.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'rest.relativeURICreate': {
      id: 'rest.relativeURICreate',
      type: 'relativeuri',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
      id: 'rest.bodyCreate',
      type: 'httprequestbody',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      refreshOptionsOnChangesTo: ['rest.lookups'],
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
      id: 'rest.successPathCreate',
      type: 'text',
      label: 'Success path',

      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
      id: 'rest.successValuesCreate',
      type: 'text',
      label: 'Success values',
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
      id: 'rest.responseIdPathCreate',
      type: 'text',
      label: 'Response ID path',
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
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
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate existing data',
      visibleWhenAll: [
        {
          field: 'rest.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'rest.compositeMethodUpdate': {
      id: 'rest.compositeMethodUpdate',
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
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'rest.relativeURIUpdate',
      type: 'relativeuri',
      arrayIndex: 0,
      connectionId: r => r && r._connectionId,
      label: 'Relative URI',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'rest.bodyUpdate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'HTTP request body',
      arrayIndex: 0,
      refreshOptionsOnChangesTo: ['rest.lookups'],
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'rest.successPathUpdate',
      type: 'text',
      label: 'Success path',

      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'rest.successValuesUpdate',
      type: 'text',
      label: 'Success values',

      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
      id: 'rest.responseIdPathUpdate',
      type: 'text',
      label: 'Response ID path',

      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
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
        if (!r || !r.rest || !r.rest.method) {
          return '';
        }

        if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return r.rest.responseIdPath && r.rest.responseIdPath[0];
        }

        return '';
      },
    },
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore existing records',
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandignore'],
        },
        {
          field: 'rest.method',
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
          field: 'rest.compositeType',
          is: ['updateandignore'],
        },
        {
          field: 'rest.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'rest.existingDataId': {
      id: 'rest.existingDataId',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
      label: 'Existing data id',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandignore'],
        },
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
        if (!r || !r.rest) {
          return '';
        }

        if (r.rest.ignoreLookupName) {
          return r.rest.ignoreLookupName;
        }
        if (r.rest.ignoreExtract) {
          return r.rest.ignoreExtract;
        }

        return '';
      },
    },
    'rest.update.existingDataId': {
      id: 'rest.update.existingDataId',
      type: 'textwithflowsuggestion',
      showSuggestionsWithoutHandlebar: true,
      label: 'Existing data id',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['updateandignore'],
        },
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
        if (!r || !r.rest) {
          return '';
        }

        if (r.rest.ignoreLookupName) {
          return r.rest.ignoreLookupName;
        }
        if (r.rest.ignoreExtract) {
          return r.rest.ignoreExtract;
        }

        return '';
      },
    },
    sampleDataTitle: {
      id: 'sampleDataTitle',
      type: 'labeltitle',
      label: 'Do you have sample data?',
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
    sampleData: {
      fieldId: 'sampleData',
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
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
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
            return 'How would you like the files transferred?';
          }

          return 'How would you like the records imported?';
        },
        fields: [
          'rest.method',
          'rest.blobMethod',
          'rest.headers',
          'rest.compositeType',
          'rest.lookups',
          'rest.relativeURI',
          'rest.body',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Create new data',
            fields: [
              'rest.compositeMethodCreate',
              'rest.relativeURICreate',
              'rest.bodyCreate',
            ],
          },
          {
            collapsed: true,
            label: 'Ignore existing records',
            fields: ['rest.existingDataId'],
          },
          {
            collapsed: true,
            label: 'Ignore new data',
            fields: ['rest.update.existingDataId'],
          },
          {
            collapsed: true,
            label: 'Update existing data',
            fields: [
              'rest.compositeMethodUpdate',
              'rest.relativeURIUpdate',
              'rest.bodyUpdate',
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
          'rest.successPath',
          'rest.successValues',
          'rest.responseIdPath',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Create new data',
            fields: [
              'rest.successPathCreate',
              'rest.successValuesCreate',
              'rest.responseIdPathCreate',
            ],
          },
          {
            collapsed: true,
            label: 'Update existing data',
            fields: [
              'rest.successPathUpdate',
              'rest.successValuesUpdate',
              'rest.responseIdPathUpdate',
            ],
          },
        ],
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
