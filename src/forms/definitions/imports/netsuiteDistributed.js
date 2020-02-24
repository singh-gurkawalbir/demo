import {
  isNewId,
  updateMappingsBasedOnNetSuiteSubrecords,
} from '../../../utils/resource';
import { isJsonString } from '../../../utils/string';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/netsuite/recordType'] = 'file';
      newValues['/distributed'] = false;
      newValues['/adaptorType'] = 'NetSuiteImport';
    }

    if (Object.hasOwnProperty.call(newValues, '/settings')) {
      let settings = newValues['/settings'];

      if (isJsonString(settings)) {
        settings = JSON.parse(settings);
      } else {
        settings = {};
      }

      newValues['/settings'] = settings;
    }

    const subrecords = newValues['/netsuite_da/subrecords'];
    let mapping = newValues['/netsuite_da/mapping'];

    if (subrecords) {
      mapping = updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecords);
    }

    return {
      ...newValues,
      '/netsuite_da/subrecords': undefined,
      '/netsuite_da/mapping': mapping,
    };
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
    blobKeyPath: { fieldId: 'blobKeyPath' },
    distributed: { fieldId: 'distributed' },
    'netsuite_da.recordType': { fieldId: 'netsuite_da.recordType' },
    'netsuite_da.mapping': { fieldId: 'netsuite_da.mapping' },
    'netsuite_da.subrecords': {
      fieldId: 'netsuite_da.subrecords',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
    },
    'netsuite_da.operation': { fieldId: 'netsuite_da.operation' },
    'netsuite.file.internalId': { fieldId: 'netsuite.file.internalId' },
    'netsuite.file.name': { fieldId: 'netsuite.file.name' },
    'netsuite.file.fileType': { fieldId: 'netsuite.file.fileType' },
    'netsuite.file.folder': { fieldId: 'netsuite.file.folder' },
    'netsuite.operation': { fieldId: 'netsuite.operation' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhenAll: [
        { field: 'netsuite_da.operation', is: ['add'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhenAll: [
        { field: 'netsuite_da.operation', is: ['update'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'netsuite_da.internalIdLookup.expression': {
      fieldId: 'netsuite_da.internalIdLookup.expression',
      refreshOptionsOnChangesTo: ['netsuite_da.recordType'],
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
    settings: { fieldId: 'settings' },
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      'distributed',
      'netsuite_da.recordType',
      'netsuite_da.mapping',
      'netsuite_da.subrecords',
      'netsuite_da.operation',
      'netsuite.operation',
      'ignoreExisting',
      'ignoreMissing',
      'netsuite_da.internalIdLookup.expression',
      'netsuite.file.internalId',
      'netsuite.file.name',
      'netsuite.file.fileType',
      'netsuite.file.folder',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings', 'deleteAfterImport'],
      },
      {
        collapsed: true,
        label: 'Custom settings',
        fields: ['settings'],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite_da.internalIdLookup.expression') {
      const recordTypeField = fields.find(
        field => field.id === 'netsuite_da.recordType'
      );

      return {
        disableFetch: !(recordTypeField && recordTypeField.value),
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
          : '',
        resetValue: [],
      };
    }

    if (fieldId === 'netsuite_da.subrecords') {
      const recordTypeField = fields.find(
        field => field.id === 'netsuite_da.recordType'
      );

      return {
        recordType: recordTypeField && recordTypeField.value,
      };
    }

    return null;
  },
};
