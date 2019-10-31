export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };
    const lookup =
      resource.http &&
      resource.http.lookups &&
      resource.http.lookups.get(retValues['/http/existingDataId']);

    if (retValues['/http/method'] === 'COMPOSITE') {
      if (retValues['/http/compositeType'] === 'CREATE_AND_UPDATE') {
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

        retValues['/http/body'] = ['', retValues['/http/bodyCreate']];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = false;
      } else if (
        retValues['/http/compositeType'] === 'CREATE_AND_IGNORE_EXISTING'
      ) {
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

        retValues['/http/body'] = ['', retValues['/http/bodyCreate']];

        retValues['/ignoreExisting'] = true;
        retValues['/ignoreMissing'] = false;

        if (lookup) {
          retValues['/http/ignoreLookupName'] =
            retValues['/http/existingDataId'];
        } else {
          retValues['/http/ignoreExtract'] = retValues['/http/existingDataId'];
        }
      } else if (retValues['/http/compositeType'] === 'UPDATE_AND_IGNORE_NEW') {
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

        retValues['/http/body'] = [retValues['/http/bodyCreate']];

        retValues['/ignoreExisting'] = false;
        retValues['/ignoreMissing'] = true;

        if (lookup) {
          retValues['/http/ignoreLookupName'] =
            retValues['/http/existingDataId'];
        } else {
          retValues['/http/ignoreExtract'] = retValues['/http/existingDataId'];
        }
      }
    } else {
      retValues['/ignoreExisting'] = false;
      retValues['/ignoreMissing'] = false;
    }

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'http.body') {
      const lookupField = fields.find(
        field => field.fieldId === 'http.lookups'
      );

      if (lookupField) {
        return {
          // we are saving http body in an array. Put correspond to 0th Index,
          // Post correspond to 1st index.
          // We will have 'Build HTTP Request Body for Create' and
          // 'Build HTTP Request Body for Update' in case user selects Composite Type as 'Create new Data and Update existing data'
          saveIndex: 0,
          lookups: {
            // passing lookupId fieldId and data since we will be modifying lookups
            //  from 'Manage lookups' option inside 'Build Http request Body Editor'
            fieldId: lookupField.fieldId,
            data: lookupField && lookupField.value,
          },
        };
      }
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
    oneToMany: { fieldId: 'oneToMany' },
    pathToMany: { fieldId: 'pathToMany' },
    'http.method': { fieldId: 'http.method' },
    'http.headers': { fieldId: 'http.headers' },
    'http.requestMediaType': { fieldId: 'http.requestMediaType' },
    'http.compositeType': { fieldId: 'http.compositeType' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.lookups': { fieldId: 'http.lookups', visible: false },
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
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
      ],
    },
    'http.compositeMethodCreate': { fieldId: 'http.compositeMethodCreate' },
    'http.relativeURICreate': { fieldId: 'http.relativeURICreate' },
    'http.bodyCreate': { fieldId: 'http.bodyCreate' },
    'http.resourceIdPathCreate': { fieldId: 'http.resourceIdPathCreate' },
    'http.resourcePathCreate': { fieldId: 'http.resourcePathCreate' },
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate Existing Data',
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
      ],
    },
    'http.compositeMethodUpdate': { fieldId: 'http.compositeMethodUpdate' },
    'http.relativeURIUpdate': { fieldId: 'http.relativeURIUpdate' },
    'http.resourceIdPathUpdate': { fieldId: 'http.resourceIdPathUpdate' },
    'http.resourcePathUpdate': { fieldId: 'http.resourcePathUpdate' },
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore Existing Data',
      visibleWhen: [
        {
          field: 'http.compositeType',
          is: ['createandignore', 'updateandignore'],
        },
      ],
    },
    'http.existingDataId': { fieldId: 'http.existingDataId' },
    mediatypeInformation: {
      id: 'mediatypeInformation',
      type: 'labeltitle',
      label: 'Media type information',
    },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    uploadFile: {
      fieldId: 'uploadFile',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'file.csv': {
      fieldId: 'file.csv',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'file.csv.includeHeader': {
      fieldId: 'file.csv.includeHeader',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'file.csv.customHeaderRows': { fieldId: 'file.csv.customHeaderRows' },
    'http.body': { fieldId: 'http.body' },
    'file.csv.rowDelimiter': {
      fieldId: 'file.csv.rowDelimiter',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'file.csv.replaceTabWithSpace': {
      fieldId: 'file.csv.replaceTabWithSpace',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'file.csv.replaceNewLineWithSpace': {
      fieldId: 'file.csv.replaceNewLineWithSpace',
      visibleWhen: [{ field: 'http.requestMediaType', is: ['csv'] }],
    },
    'http.ignoreEmptyNodes': { fieldId: 'http.ignoreEmptyNodes' },
    advancedSettings: { formId: 'advancedSettings' },
    'http.configureAsyncHelper': { fieldId: 'http.configureAsyncHelper' },
    'http._asyncHelperId': { fieldId: 'http._asyncHelperId' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'oneToMany',
      'pathToMany',
      'http.method',
      'http.headers',
      'http.requestMediaType',
      'http.compositeType',
      'http.relativeURI',
      'http.lookups',
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
      // 'http.bodyUpdate',
      'http.resourceIdPathUpdate',
      'http.resourcePathUpdate',
      'ignoreExistingData',
      'http.existingDataId',
      'mediatypeInformation',
      'http.successMediaType',
      'http.errorMediaType',
      'uploadFile',
      'file.csv.columnDelimiter',
      'file.csv.includeHeader',
      'file.csv.customHeaderRows',
      'http.body',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'file.csv.rowDelimiter',
          'file.csv.replaceTabWithSpace',
          'file.csv.replaceNewLineWithSpace',
          'http.ignoreEmptyNodes',
          'advancedSettings',
          'http.configureAsyncHelper',
          'http._asyncHelperId',
        ],
      },
    ],
  },
};
