export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'rest.method' },
    { fieldId: 'rest.headers' },
    { fieldId: 'rest.compositeType' },
    { fieldId: 'rest.relativeUri' },
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
          is: ['CREATE_AND_UPDATE', 'CREATE_AND_IGNORE'],
        },
      ],
    },
    { fieldId: 'rest.compositeMethodCreate' },
    { fieldId: 'rest.relativeUriCreate' },
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
          is: ['CREATE_AND_UPDATE', 'UPDATE_AND_IGNORE'],
        },
      ],
    },
    { fieldId: 'rest.compositeMethodUpdate' },
    { fieldId: 'rest.relativeUriUpdate' },
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
          is: ['CREATE_AND_IGNORE', 'UPDATE_AND_IGNORE'],
        },
      ],
    },
    { fieldId: 'rest.existingDataId' },
    {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    { fieldId: 'rest.ifSoPleasePasteItHere' },
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
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'rest.concurrencyIdLockTemplate' },
        { fieldId: 'rest.dataUriTemplate' },
      ],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
  ],
};
