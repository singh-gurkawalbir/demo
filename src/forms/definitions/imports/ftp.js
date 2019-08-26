export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'ftp.directoryPath' },
    { fieldId: 'ftp.fileType' },
    { fieldId: 'ftp.fileName' },
    { fieldId: 'ftp.sampleFile' },
    { fieldId: 'ftp.columnDelimiter' },
    { fieldId: 'ftp.includeHeader' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 'ftp.parentOption' },
    { fieldId: 'ftp.childRecords' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 'ftp.rowDelimiter' },
        { fieldId: 'ftp.useTempFile' },
        { fieldId: 'ftp.inProgressFileName' },
        { fieldId: 'ftp.skipAggregation' },
        { fieldId: 'ftp.compressFiles' },
        { fieldId: 'ftp.compressionFormat' },
        { fieldId: 'ftp.wrapWithQuotes' },
        { fieldId: 'ftp.replaceTabWithSpace' },
        { fieldId: 'ftp.replaceNewLineWithSpace' },
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
