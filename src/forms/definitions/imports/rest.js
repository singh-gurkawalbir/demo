import { isNewId } from '../../../utils/resource';
import { isJsonString } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const lookups = retValues['/rest/lookups'];
    const lookup =
      lookups &&
      lookups.find(l => l.name === retValues['/rest/existingDataId']);
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
          retValues['/rest/requestTypeUpdate'],
          retValues['/rest/requestTypeCreate'],
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
        retValues['/rest/requestType'] = [retValues['/rest/requestTypeCreate']];

        retValues['/rest/relativeURI'] = [retValues['/rest/relativeURICreate']];
        retValues['/rest/method'] = [retValues['/rest/compositeMethodCreate']];

        retValues['/rest/ignoreLookupName'] = undefined;
        retValues['/rest/ignoreExtract'] = undefined;

        if (retValues['/rest/responseIdPathCreate']) {
          retValues['/rest/responseIdPath'] = [
            retValues['/rest/responseIdPathCreate'],
          ];
        }

        if (retValues['/rest/bodyCreate'])
          retValues['/rest/body'] = [retValues['/rest/bodyCreate']];
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
        retValues['/rest/requestType'] = [retValues['/rest/requestTypeUpdate']];

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
            retValues['/rest/existingDataId'];
          retValues['/rest/ignoreExtract'] = null;
        } else {
          retValues['/rest/ignoreExtract'] = retValues['/rest/existingDataId'];
          retValues['/rest/ignoreLookupName'] = null;
        }

        retValues['/rest/existingDataId'] = undefined;
      }
    } else {
      if (!retValues['/rest/requestType'])
        retValues['/rest/requestType'] =
          retValues['/rest/method'] === 'POST' ? ['CREATE'] : ['UPDATE'];

      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
      retValues['/rest/body'] = retValues['/rest/body']
        ? [retValues['/rest/body']]
        : [];
      retValues['/rest/ignoreLookupName'] = undefined;
      retValues['/rest/ignoreExtract'] = undefined;
      retValues['/rest/existingDataId'] = undefined;
    }

    delete retValues['/inputMode'];

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
      )
        return 'Sample Data must be a valid JSON';
    }
  },
  optionsHandler: (fieldId, fields) => {
    if (
      fieldId === 'rest.body' ||
      fieldId === 'rest.relativeURI' ||
      fieldId === 'rest.relativeURICreate' ||
      fieldId === 'rest.relativeURIUpdate' ||
      fieldId === 'rest.existingDataId'
    ) {
      const lookupField = fields.find(
        field => field.fieldId === 'rest.lookups'
      );
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
        lookups: {
          fieldId: 'rest.lookups',
          data:
            (lookupField &&
              Array.isArray(lookupField.value) &&
              lookupField.value) ||
            [],
        },
      };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    inputMode: {
      id: 'inputMode',
      type: 'mode',
      label: 'Input Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => (r && r.blobKeyPath ? 'blob' : 'records'),
    },
    'rest.method': { fieldId: 'rest.method' },
    'rest.blobMethod': { fieldId: 'rest.blobMethod' },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.compositeType': { fieldId: 'rest.compositeType' },
    'rest.lookups': { fieldId: 'rest.lookups', visible: false },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.requestType': { fieldId: 'rest.requestType' },
    'rest.body': { fieldId: 'rest.body' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    'rest.responseIdPath': { fieldId: 'rest.responseIdPath' },
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create New Data',
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
      label: 'HTTP Method',
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
      type: 'textwithlookupextract',
      fieldType: 'relativeUri',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rest.lookups', 'name'],
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
    'rest.requestTypeCreate': {
      id: 'rest.requestTypeCreate',
      type: 'select',
      label: 'RequestType',
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
      helpText:
        'Please specify whether the record is being created or updated using this field.',
      defaultValue: r => {
        if (!r || !r.rest || !r.rest.method) {
          return '';
        }

        if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.rest.method.length > 1) {
            return r.rest.requestType && r.rest.requestType[1];
          }

          return r.rest.requestType && r.rest.requestType[0];
        }

        return '';
      },
    },
    'rest.bodyCreate': {
      id: 'rest.bodyCreate',
      type: 'httprequestbody',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP Request Body',
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
      label: 'Success Path',
      placeholder: 'Optional',
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
      label: 'Success Values',
      placeholder: 'Optional',
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
      label: 'Response Id Path',
      placeholder: 'Optional',
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
      label: 'Upate Existing Data',
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
      label: 'HTTP Method',
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
      type: 'textwithlookupextract',
      fieldType: 'relativeUri',
      arrayIndex: 0,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rest.lookups', 'name'],
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
    'rest.requestTypeUpdate': {
      id: 'rest.requestTypeUpdate',
      type: 'select',
      label: 'Request Type',
      options: [
        {
          items: [
            { label: 'CREATE', value: 'CREATE' },
            { label: 'UPDATE', value: 'UPDATE' },
          ],
        },
      ],
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
      helpText:
        'Please specify whether the record is being created or updated using this field.',
      defaultValue: r => {
        if (!r || !r.rest || !r.rest.method) {
          return '';
        }

        if (r.rest.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return r.rest.requestType && r.rest.requestType[0];
        }

        return '';
      },
    },
    'rest.bodyUpdate': {
      id: 'rest.bodyUpdate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP Request Body',
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
      label: 'Success Path',
      placeholder: 'Optional',
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
      label: 'Success Values',
      placeholder: 'Optional',
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
      label: 'Response Id Path',
      placeholder: 'Optional',
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
      label: 'Ignore Existing Data',
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
      label: 'Ignore New Data',
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
      type: 'textwithlookupextract',
      fieldType: 'ignoreExistingData',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rest.lookups', 'name'],
      label: 'Existing Data Id',
      required: true,
      visibleWhenAll: [
        {
          field: 'rest.compositeType',
          is: ['createandignore', 'updateandignore'],
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
        } else if (r.rest.ignoreExtract) {
          return r.rest.ignoreExtract;
        }

        return '';
      },
    },
    sampleDataTitle: {
      id: 'sampleDataTitle',
      type: 'labeltitle',
      label: 'Do you have sample data?',
      visibleWhen: [
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
    },
    dataMappings: {
      formId: 'dataMappings',
    },
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
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      'rest.method',
      'rest.blobMethod',
      'rest.headers',
      'rest.compositeType',
      'rest.lookups',
      // 'mapping',
      'rest.relativeURI',
      'rest.requestType',
      'rest.body',
      'rest.successPath',
      'rest.successValues',
      'rest.responseIdPath',
      'createNewData',
      'rest.compositeMethodCreate',
      'rest.relativeURICreate',
      'rest.requestTypeCreate',
      'rest.bodyCreate',
      'rest.successPathCreate',
      'rest.successValuesCreate',
      'rest.responseIdPathCreate',
      'upateExistingData',
      'rest.compositeMethodUpdate',
      'rest.relativeURIUpdate',
      'rest.requestTypeUpdate',
      'rest.bodyUpdate',
      'rest.successPathUpdate',
      'rest.successValuesUpdate',
      'rest.responseIdPathUpdate',
      'ignoreExistingData',
      'ignoreNewData',
      'rest.existingDataId',
      'sampleDataTitle',
      'sampleData',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings', 'deleteAfterImport'],
      },
    ],
  },
};
