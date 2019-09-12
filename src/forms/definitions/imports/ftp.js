export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    { fieldId: 'ftp.directoryPath' },
    { formId: 'fileType' },
    { fieldId: 'ftp.fileName' },
    { formId: 'file' },
    { formId: 'dataMappings' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'file.csv.rowDelimiter' },
        { fieldId: 'ftp.useTempFile' },
        { fieldId: 'ftp.inProgressFileName' },
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
