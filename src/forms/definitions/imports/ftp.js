export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 'ftp.directoryPath' },
    { fieldId: 'file.type' },
    { fieldId: 'file.edifactFormat' },
    { fieldId: 'file.format' },
    { fieldId: 'file.ediX12Format' },
    { fieldId: 'ftp.fileName' },
    { fieldId: 'uploadFile' },
    { fieldId: 'file.csv.columnDelimiter' },
    { fieldId: 'file.includeHeader' },
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
        { fieldId: 'file.csv.rowDelimiter' },
        { fieldId: 'ftp.useTempFile' },
        { fieldId: 'ftp.inProgressFileName' },
        { fieldId: 'file.skipAggregation' },
        { fieldId: 'file.compressFiles' },
        { fieldId: 'file.compressionFormat' },
        { fieldId: 'file.wrapWithQuotes' },
        { fieldId: 'file.replaceTabWithSpace' },
        { fieldId: 'file.replaceNewLineWithSpace' },
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
