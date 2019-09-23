export default {
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
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
    suiteScript: {
      id: 'suiteScript',
      type: 'labeltitle',
      label: 'SuiteScript Hooks (Optional, Developers Only)',
    },
    'netsuite_da.hooks.preMap.function': {
      fieldId: 'netsuite_da.hooks.preMap.function',
    },
    'netsuite_da.hooks.preMap.fileInternalId': {
      fieldId: 'netsuite_da.hooks.preMap.fileInternalId',
    },
    'netsuite_da.hooks.postMap.function': {
      fieldId: 'netsuite_da.hooks.postMap.function',
    },
    'netsuite_da.hooks.postMap.fileInternalId': {
      fieldId: 'netsuite_da.hooks.postMap.fileInternalId',
    },
    'netsuite_da.hooks.postSubmit.function': {
      fieldId: 'netsuite_da.hooks.postSubmit.function',
    },
    'netsuite_da.hooks.postSubmit.fileInternalId': {
      fieldId: 'netsuite_da.hooks.postSubmit.fileInternalId',
    },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
    hookType: { fieldId: 'hookType' },
    'hooks.preMap.function': { fieldId: 'hooks.preMap.function' },
    'hooks.preMap._scriptId': { fieldId: 'hooks.preMap._scriptId' },
    'hooks.preMap._stackId': { fieldId: 'hooks.preMap._stackId' },
    'hooks.postSubmit.function': { fieldId: 'hooks.postSubmit.function' },
    'hooks.postSubmit._scriptId': { fieldId: 'hooks.postSubmit._scriptId' },
    'hooks.postSubmit._stackId': { fieldId: 'hooks.postSubmit._stackId' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'netsuite_da.recordType',
      'netsuite_da.operation',
      'ignoreExisting',
      'ignoreMissing',
      'netsuite_da.internalIdLookup.expression',
      'suiteScript',
      'netsuite_da.hooks.preMap.function',
      'netsuite_da.hooks.preMap.fileInternalId',
      'netsuite_da.hooks.postMap.function',
      'netsuite_da.hooks.postMap.fileInternalId',
      'netsuite_da.hooks.postSubmit.function',
      'netsuite_da.hooks.postSubmit.fileInternalId',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
      {
        collapsed: false,
        label: 'Hooks (Optional, Developers Only)',
        fields: [
          'hookType',
          'hooks.preMap.function',
          'hooks.preMap._scriptId',
          'hooks.preMap._stackId',
          'hooks.postSubmit.function',
          'hooks.postSubmit._scriptId',
          'hooks.postSubmit._stackId',
        ],
      },
    ],
  },
};
