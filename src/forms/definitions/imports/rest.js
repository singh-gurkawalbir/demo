import { adaptorTypeMap } from '../../../utils/resource';

export default {
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
    'rest.method': { fieldId: 'rest.method' },
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
      ],
    },
    'rest.existingDataId': { fieldId: 'rest.existingDataId' },
    sampleData: {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    'rest.sampleData': { fieldId: 'rest.sampleData' },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
    hooks: { formId: 'hooks' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'rest.method',
      'rest.headers',
      'rest.compositeType',
      'rest.lookups',
      'mapping',
      'rest.relativeURI',
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
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
      {
        collapsed: false,
        label: 'Hooks (Optional, Developers Only)',
        fields: ['hooks'],
      },
    ],
  },
};
