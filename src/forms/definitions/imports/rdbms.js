export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'rdbms.queryType' },
    { fieldId: 'rdbms.ignoreExistingRecords' },
    { fieldId: 'rdbms.ignoreMissingRecords' },
    { fieldId: 'rdbms.existingDataId' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'file.parentOption' },
    { fieldId: 'file.childRecords' },
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
