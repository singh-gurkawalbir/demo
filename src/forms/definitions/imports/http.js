export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/http/method'] = newValues['/http/blobMethod'];
    }

    return {
      ...newValues,
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

    if (fieldId === 'mapping') {
      const lookupField = fields.find(
        field => field.fieldId === 'http.lookups'
      );

      if (lookupField) {
        return {
          lookupId: 'http.lookups',
          lookups: lookupField && lookupField.value,
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
    dataMappings: { formId: 'dataMappings' },
    inputMode: {
      id: 'inputMode',
      type: 'radiogroup',
      label: 'Input Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => (r && r.blobKeyPath ? 'blob' : 'records'),
    },
    'http.method': { fieldId: 'http.method' },
    'http.blobMethod': { fieldId: 'http.blobMethod' },
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
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'http.compositeMethodCreate': { fieldId: 'http.compositeMethodCreate' },
    'http.bodyCreate': { fieldId: 'http.bodyCreate' },
    'http.resourceIdPathCreate': { fieldId: 'http.resourceIdPathCreate' },
    'http.resourcePathCreate': { fieldId: 'http.resourcePathCreate' },
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate Existing Data',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'inputMode',
          is: ['records'],
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
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandignore', 'updateandignore'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'http.existingDataId': { fieldId: 'http.existingDataId' },
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
      id: 'file.csv',
      type: 'csvparse',
      label: 'Configure CSV parse options',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv.customHeaderRows': { fieldId: 'file.csv.customHeaderRows' },
    mapping: {
      fieldId: 'mapping',
      refreshOptionsOnChangesTo: ['http.lookups'],
    },
    'http.body': { fieldId: 'http.body' },
    'file.csv.rowDelimiter': {
      id: 'file.csv.rowDelimiter',
      type: 'checkbox',
      label: 'Row Delimiter',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv.wrapWithQuotes': {
      id: 'file.csv.wrapWithQuotes',
      type: 'checkbox',
      label: 'Wrap with quotes',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv.replaceTabWithSpace': {
      id: 'file.csv.replaceTabWithSpace',
      type: 'checkbox',
      label: 'Replace tab with space',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv.replaceNewLineWithSpace': {
      id: 'file.csv.replaceNewLineWithSpace',
      type: 'checkbox',
      label: 'Replace new line with space',
      visibleWhenAll: [
        { field: 'http.requestMediaType', is: ['csv'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
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
      'http.relativeURI',
      'http.lookups',
      'http.body',
      'http.response.successPath',
      'http.response.successValues',
      'http.response.resourceIdPath',
      'http.response.resourcePath',
      'http.response.errorPath',
      'http.batchSize',
      'createNewData',
      'http.compositeMethodCreate',
      'http.bodyCreate',
      'http.resourceIdPathCreate',
      'http.resourceIdPathCreate',
      'http.resourcePathCreate',
      'upateExistingData',
      'http.compositeMethodUpdate',
      'http.relativeURIUpdate',
      'http.resourceIdPathUpdate',
      'http.resourcePathUpdate',
      'ignoreExistingData',
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
          'file.csv.rowDelimiter',
          'file.csv.wrapWithQuotes',
          'file.csv.replaceTabWithSpace',
          'file.csv.replaceNewLineWithSpace',
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
