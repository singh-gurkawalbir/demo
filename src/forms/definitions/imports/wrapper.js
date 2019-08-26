export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'wrapper.function' },
    { fieldId: 'wrapper.configuration' },
    {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    { fieldId: 'wrapper.ifSoPleasePasteItHere' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'wrapper.parentOption' },
    { fieldId: 'wrapper.childRecords' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'wrapper.concurrencyIdLockTemplate' },
        { fieldId: 'wrapper.dataUriTemplate' },
      ],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
  ],
};
