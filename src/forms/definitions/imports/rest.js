export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'rest.method' },
    { fieldId: 'rest.headers' },
    { fieldId: 'rest.compositeType' },
    { fieldId: 'rest.relativeURI' },
    { fieldId: 'rest.successPath' },
    { fieldId: 'rest.successValues' },
    { fieldId: 'rest.responseIdPath' },
    {
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
    { fieldId: 'rest.compositeMethodCreate' },
    { fieldId: 'rest.relativeURICreate' },
    { fieldId: 'rest.successPathCreate' },
    { fieldId: 'rest.successValuesCreate' },
    { fieldId: 'rest.responseIdPathCreate' },
    {
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
    { fieldId: 'rest.compositeMethodUpdate' },
    { fieldId: 'rest.relativeURIUpdate' },
    { fieldId: 'rest.successPathUpdate' },
    { fieldId: 'rest.successValuesUpdate' },
    { fieldId: 'rest.responseIdPathUpdate' },
    {
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
    { fieldId: 'rest.existingDataId' },
    {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    { fieldId: 'rest.sampleData' },
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
