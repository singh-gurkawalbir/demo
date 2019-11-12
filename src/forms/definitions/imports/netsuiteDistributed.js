import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/inputMode'] === 'blob') {
      newValues['/netsuite_da/operation'] =
        newValues['/netsuite_da/blob/operation'];
    }

    return {
      ...newValues,
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
    'netsuite_da.operation': { fieldId: 'netsuite_da.operation' },
    'netsuite.file.internalId': { fieldId: 'netsuite.file.internalId' },
    'netsuite.file.name': { fieldId: 'netsuite.file.name' },
    'netsuite.file.fileType': { fieldId: 'netsuite.file.fileType' },
    'netsuite.file.folder': { fieldId: 'netsuite.file.folder' },
    'netsuite_da.blob.operation': { fieldId: 'netsuite_da.blob.operation' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        { field: 'netsuite_da.operation', is: ['add'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhen: [
        { field: 'netsuite_da.operation', is: ['update'] },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    'netsuite_da.internalIdLookup.expression': {
      fieldId: 'netsuite_da.internalIdLookup.expression',
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
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      'distributed',
      'netsuite_da.recordType',
      'netsuite_da.operation',
      'netsuite_da.blob.operation',
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
    ],
  },
};
