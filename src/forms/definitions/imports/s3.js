export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 's3.region' },
    { fieldId: 's3.bucket' },
    { formId: 'fileType' },
    { fieldId: 's3.fileKey' },
    { formId: 'file' },
    { formId: 'dataMappings' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'file.csv.rowDelimiter' },
        { formId: 'fileAdvancedSettings' },
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
