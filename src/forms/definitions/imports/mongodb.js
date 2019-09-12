export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'mongodb.method' },
    { fieldId: 'mongodb.collection' },
    {
      fieldId: 'ignoreExisting',
      visibleWhen: [
        {
          field: 'mongodb.method',
          is: ['insertMany'],
        },
      ],
    },
    { fieldId: 'mongodb.lookupType' },
    { fieldId: 'mongodb.ignoreLookupFilters' },
    { fieldId: 'mongodb.filter' },
    { fieldId: 'mongodb.upsert' },
    {
      fieldId: 'ignoreMissing',
      visibleWhen: [
        {
          field: 'mongodb.method',
          is: ['updateOne'],
        },
      ],
    },
    { fieldId: 'mongodb.ignoreExtract' },
    { formId: 'dataMappings' },
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
