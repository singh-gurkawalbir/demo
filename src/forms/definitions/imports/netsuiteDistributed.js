export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'netsuite_da.recordType' },
    { fieldId: 'netsuite_da.operation' },
    {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        {
          field: 'netsuite_da.operation',
          is: ['add'],
        },
      ],
    },
    {
      fieldId: 'ignoreMissing',
      visibleWhen: [
        {
          field: 'netsuite_da.operation',
          is: ['update'],
        },
      ],
    },
    { fieldId: 'netsuite_da.internalIdLookup.expression' },
    {
      id: 'suiteScript',
      type: 'labeltitle',
      label: 'SuiteScript Hooks (Optional, Developers Only)',
    },
    { fieldId: 'netsuite_da.hooks.preMap.function' },
    { fieldId: 'netsuite_da.hooks.preMap.fileInternalId' },
    { fieldId: 'netsuite_da.hooks.postMap.function' },
    { fieldId: 'netsuite_da.hooks.postMap.fileInternalId' },
    { fieldId: 'netsuite_da.hooks.postSubmit.function' },
    { fieldId: 'netsuite_da.hooks.postSubmit.fileInternalId' },
    { formId: 'dataMappings' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [
        { fieldId: 'hookType' },
        { fieldId: 'hooks.preMap.function' },
        { fieldId: 'hooks.preMap._scriptId' },
        { fieldId: 'hooks.preMap._stackId' },
        { fieldId: 'hooks.postSubmit.function' },
        { fieldId: 'hooks.postSubmit._scriptId' },
        { fieldId: 'hooks.postSubmit._stackId' },
      ],
    },
  ],
};
