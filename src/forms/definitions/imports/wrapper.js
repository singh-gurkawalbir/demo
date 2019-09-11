export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'wrapper.function' },
    { fieldId: 'wrapper.configuration' },
    {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    { fieldId: 'wrapper.sampleData' },
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
      header: 'Advanced',
      collapsed: true,
      fields: [{ fieldId: 'idLockTemplate' }, { fieldId: 'dataURITemplate' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
  ],
};
