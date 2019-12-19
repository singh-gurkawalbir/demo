import { isNewId } from '../../../utils/resource';

export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };
    const lookup =
      resource.http &&
      resource.http.lookups &&
      resource.http.lookups.find(
        l => l.name === retValues['/http/existingDataId']
      );

    if (retValues['/inputMode'] === 'blob') {
      retValues['/http/method'] = retValues['/http/blobMethod'];
    } else if (retValues['/http/method'] === 'COMPOSITE') {
      if (retValues['/http/compositeType'] === 'createandupdate') {
        retValues['/http/relativeURI'] = [
          retValues['/http/relativeURIUpdate'],
          retValues['/http/relativeURICreate'],
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
        }

        if (
          retValues['/http/resourcePathCreate'] ||
          retValues['/http/resourcePathUpdate']
        ) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathUpdate'],
            retValues['/http/resourcePathCreate'],
          ];
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
        }

        if (retValues['/http/resourcePathCreate']) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathCreate'],
          ];
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
        }

        if (retValues['/http/resourcePathUpdate']) {
          retValues['/http/response/resourcePath'] = [
            retValues['/http/resourcePathUpdate'],
          ];
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
      retValues['/http/body'] = [retValues['/http/body']];
    }

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
      const lookupField = fields.find(
        field => field.fieldId === 'http.lookups'
      );
      const requestMediaTypeField = fields.find(
        field => field.fieldId === 'http.requestMediaType'
      );
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
        contentType: requestMediaTypeField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'Build Http request Body Editor'
          fieldId: 'http.lookups',
          data:
            (lookupField &&
              Array.isArray(lookupField.value) &&
              lookupField.value) ||
            [],
        },
      };
    }

    if (
      fieldId === 'http.relativeURI' ||
      fieldId === 'http.relativeURIUpdate' ||
      fieldId === 'http.relativeURICreate' ||
      fieldId === 'http.existingDataId'
    ) {
      const lookupField = fields.find(
        field => field.fieldId === 'http.lookups'
      );
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
        lookups: {
          fieldId: 'http.lookups',
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
    dataMappings: { formId: 'dataMappings' },
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
    'http.method': { fieldId: 'http.method' },
    'http.blobMethod': { fieldId: 'http.blobMethod' },
    'http.headers': { fieldId: 'http.headers' },
    'http.requestMediaType': { fieldId: 'http.requestMediaType' },
    'http.compositeType': { fieldId: 'http.compositeType' },
    'http.lookups': { fieldId: 'http.lookups', visible: false },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': { fieldId: 'http.response.successValues' },
    'http.response.resourceIdPath': { fieldId: 'http.response.resourceIdPath' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    'http.batchSize': { fieldId: 'http.batchSize' },
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create New Data',
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
      type: 'textwithlookupextract',
      fieldType: 'relativeUri',
      arrayIndex: 1,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['http.lookups', 'name'],
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
    'http.bodyCreate': {
      id: 'http.bodyCreate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP Request Body For Create',
      arrayIndex: 1,
      refreshOptionsOnChangesTo: [
        'http.lookups',
        'http.requestMediaType',
        'name',
      ],
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
    'http.resourceIdPathCreate': {
      id: 'http.resourceIdPathCreate',
      type: 'text',
      label: 'Response Id Path',
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
      label: 'Response Path',
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
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Update Existing Data',
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
      type: 'textwithlookupextract',
      fieldType: 'relativeUri',
      arrayIndex: 0,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['http.lookups', 'name'],
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
    'http.bodyUpdate': {
      id: 'http.bodyUpdate',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Build HTTP Request Body For Update',
      arrayIndex: 0,
      refreshOptionsOnChangesTo: [
        'http.lookups',
        'http.requestMediaType',
        'name',
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
          return r.http.body[0];
        }

        return '';
      },
    },
    'http.resourceIdPathUpdate': {
      id: 'http.resourceIdPathUpdate',
      type: 'text',
      label: 'Response Id Path',
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
      label: 'Response Path',
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
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore Existing Data',
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
      label: 'Ignore New Data',
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
      type: 'textwithlookupextract',
      fieldType: 'ignoreExistingData',
      label: 'Existing Data Id',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['http.lookups', 'name'],
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
      label: 'Sample File (that would be imported)',
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
      refreshOptionsOnChangesTo: [
        'http.requestMediaType',
        'http.lookups',
        'name',
      ],
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
      'http.response.resourceIdPath',
      'http.response.resourcePath',
      'http.response.errorPath',
      'http.batchSize',
      'createNewData',
      'http.compositeMethodCreate',
      'http.relativeURICreate',
      'http.bodyCreate',
      'http.resourceIdPathCreate',
      'http.resourcePathCreate',
      'upateExistingData',
      'http.compositeMethodUpdate',
      'http.relativeURIUpdate',
      'http.bodyUpdate',
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
