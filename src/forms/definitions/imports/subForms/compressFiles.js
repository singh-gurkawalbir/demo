export default {
  fields: [
    {
      id: 'file.compressFiles',
      type: 'checkbox',
      label: 'Compress Files',
    },
    {
      fieldId: 'file.compressionFormat',
      visibleWhen: [
        {
          field: 'file.compressFiles',
          is: [true],
        },
      ],
      requiredWhen: [
        {
          field: 'file.compressFiles',
          is: [true],
        },
      ],
    },
  ],
};
