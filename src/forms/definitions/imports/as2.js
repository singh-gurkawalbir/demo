export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'as2.ediFormat' },
    { fieldId: 'as2.fileName' },
    { fieldId: 'as2.messageId' },
    { fieldId: 'as2.headers' },
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
        { fieldId: 'file.compressFiles' },
        { fieldId: 'file.compressionFormat' },
        { fieldId: 'as2.maxRetries' },
      ],
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
