import { adaptorTypeMap } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'BLOB') {
      newValues['/rest/method'] = newValues['/rest/blobMethod'];
    }

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'mapping') {
      const lookupField = fields.find(
        field => field.fieldId === 'rest.lookups'
      );

      if (lookupField) {
        return {
          lookupId: 'rest.lookups',
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
    inputMode: {
      id: 'inputMode',
      type: 'radiogroup',
      label: 'Input Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'RECORDS' },
            { label: 'Blob Keys', value: 'BLOB' },
          ],
        },
      ],
      defaultValue: r => (r && r.blobKeyPath ? 'BLOB' : 'RECORDS'),
    },
    'rest.method': { fieldId: 'rest.method' },
    'rest.blobMethod': { fieldId: 'rest.blobMethod' },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.compositeType': { fieldId: 'rest.compositeType' },
    'rest.lookups': { fieldId: 'rest.lookups', visible: false },
    mapping: {
      fieldId: 'mapping',
      application: adaptorTypeMap.RESTImport,
      refreshOptionsOnChangesTo: ['rest.lookups'],
    },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    'rest.responseIdPath': { fieldId: 'rest.responseIdPath' },
    createNewData: {
      id: 'createNewData',
      type: 'labeltitle',
      label: 'Create New Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'createandignore'],
        },
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    'rest.compositeMethodCreate': { fieldId: 'rest.compositeMethodCreate' },
    'rest.relativeURICreate': { fieldId: 'rest.relativeURICreate' },
    'rest.successPathCreate': { fieldId: 'rest.successPathCreate' },
    'rest.successValuesCreate': { fieldId: 'rest.successValuesCreate' },
    'rest.responseIdPathCreate': { fieldId: 'rest.responseIdPathCreate' },
    upateExistingData: {
      id: 'upateExistingData',
      type: 'labeltitle',
      label: 'Upate Existing Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    'rest.compositeMethodUpdate': { fieldId: 'rest.compositeMethodUpdate' },
    'rest.relativeURIUpdate': { fieldId: 'rest.relativeURIUpdate' },
    'rest.successPathUpdate': { fieldId: 'rest.successPathUpdate' },
    'rest.successValuesUpdate': { fieldId: 'rest.successValuesUpdate' },
    'rest.responseIdPathUpdate': { fieldId: 'rest.responseIdPathUpdate' },
    ignoreExistingData: {
      id: 'ignoreExistingData',
      type: 'labeltitle',
      label: 'Ignore Existing Data',
      visibleWhen: [
        {
          field: 'rest.compositeType',
          is: ['createandignore', 'updateandignore'],
        },
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    'rest.existingDataId': { fieldId: 'rest.existingDataId' },
    sampleData: {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    'rest.sampleData': { fieldId: 'rest.sampleData' },
    'rest.body': { fieldId: 'rest.body' },
    dataMappings: {
      formId: 'dataMappings',
    },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['BLOB'],
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
      'mapping',
      'rest.relativeURI',
      'rest.body',
      'rest.successPath',
      'rest.successValues',
      'rest.responseIdPath',
      'createNewData',
      'rest.compositeMethodCreate',
      'rest.relativeURICreate',
      'rest.successPathCreate',
      'rest.successValuesCreate',
      'rest.responseIdPathCreate',
      'upateExistingData',
      'rest.compositeMethodUpdate',
      'rest.relativeURIUpdate',
      'rest.successPathUpdate',
      'rest.successValuesUpdate',
      'rest.responseIdPathUpdate',
      'ignoreExistingData',
      'rest.existingDataId',
      'sampleData',
      'rest.sampleData',
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
