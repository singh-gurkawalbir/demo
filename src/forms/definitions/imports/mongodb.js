export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'mongodb.method' },
    { fieldId: 'mongodb.collection' },
    { fieldId: 'mongodb.ignoreExisting' },
    { fieldId: 'mongodb.identifyExistingRecords' },
    { fieldId: 'mongodb.whichField' },
    { fieldId: 'mongodb.ignoreLookupFilters' },
    { fieldId: 'mongodb.filter' },
    { fieldId: 'mongodb.upsert' },
    { fieldId: 'mongodb.ignoreMissing' },
    { fieldId: 'mongodb.whichField?' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'mongodb.parentOption' },
    { fieldId: 'mongodb.childRecords' },
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
