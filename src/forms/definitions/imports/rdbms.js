export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'rdbms.queryType' },
    {
      fieldId: 'ignoreExisting',
      label: 'Ignore Existing Records',
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['INSERT'],
        },
      ],
    },
    {
      fieldId: 'ignoreMissing',
      label: 'Ignore Missing Records',
      visibleWhen: [
        {
          field: 'rdbms.queryType',
          is: ['UPDATE'],
        },
      ],
    },
    { fieldId: 'rdbms.existingDataId' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'oneToMany' },
    { fieldId: 'pathToMany' },
  ],
  fieldSets: [
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [
        { formId: 'hooks' },
        { fieldId: 'hooks.postAggregate.function' },
        { fieldId: 'hooks.postAggregate._scriptId' },
        { fieldId: 'hooks.postAggregate._stackId' },
      ],
    },
  ],
};
