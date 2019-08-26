export default {
  fields: [
    { formId: 'common' },
    {
      id: 'importData',
      type: 'labeltitle',
      label: 'What would you like the data imported?',
    },
    { fieldId: 's3.region' },
    { fieldId: 's3.bucketName' },
    { fieldId: 's3.fileType' },
    { fieldId: 's3.fileKey' },
    { fieldId: 's3.sampleFile' },
    { fieldId: 's3.columnDelimiter' },
    { fieldId: 's3.includeHeader' },
    {
      id: 'dataMapped',
      type: 'labeltitle',
      label: 'How should the data be mapped?',
    },
    { fieldId: 's3.parentOption' },
    { fieldId: 's3.childRecords' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [
        { fieldId: 's3.rowDelimiter' },
        { fieldId: 's3.skipAggregation' },
        { fieldId: 's3.compressFiles' },
        { fieldId: 's3.compressionFormat' },
        { fieldId: 's3.wrapWithQuotes' },
        { fieldId: 's3.replaceTabWithSpace' },
        { fieldId: 's3.replaceNewLineWithSpace' },
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
