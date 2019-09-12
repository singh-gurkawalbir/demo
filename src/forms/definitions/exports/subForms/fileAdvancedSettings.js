export default {
  fields: [
    {
      id: 'file.decompressFiles',
      type: 'checkbox',
      label: 'Decompress Files',
    },
    {
      fieldId: 'file.compressionFormat',
      visibleWhen: [{ field: 'file.decompressFiles', is: [true] }],
    },
    { fieldId: 'file.skipDelete' },
    { fieldId: 'file.encoding' },
    { fieldId: 'pageSize' },
    { fieldId: 'dataURITemplate' },
  ],
};
