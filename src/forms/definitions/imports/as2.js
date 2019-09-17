export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    // To Do replace statistcally instead dynamic values
    { fieldId: 'ediX12Format', label: 'EDI Format' },
    { fieldId: 'as2.fileNameTemplate' },
    { fieldId: 'as2.messageIdTemplate' },
    { fieldId: 'as2.headers' },
    { formId: 'dataMappings' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'compressFiles' }, { fieldId: 'as2.maxRetries' }],
    },
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
