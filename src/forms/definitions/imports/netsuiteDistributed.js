export default {
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    distributed: { fieldId: 'distributed' },
    'netsuite_da.recordType': { fieldId: 'netsuite_da.recordType' },
    'netsuite_da.operation': { fieldId: 'netsuite_da.operation' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      visibleWhen: [{ field: 'netsuite_da.operation', is: ['add'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      visibleWhen: [{ field: 'netsuite_da.operation', is: ['update'] }],
    },
    'netsuite_da.internalIdLookup.expression': {
      fieldId: 'netsuite_da.internalIdLookup.expression',
    },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'distributed',
      'netsuite_da.recordType',
      'netsuite_da.operation',
      'ignoreExisting',
      'ignoreMissing',
      'netsuite_da.internalIdLookup.expression',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
