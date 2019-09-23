export default {
  fieldMap: {
    'file.compressFiles': {
      id: 'file.compressFiles',
      type: 'checkbox',
      label: 'Compress Files',
    },
    'file.compressionFormat': {
      fieldId: 'file.compressionFormat',
      visibleWhen: [{ field: 'file.compressFiles', is: [true] }],
      requiredWhen: [{ field: 'file.compressFiles', is: [true] }],
    },
  },
  layout: { fields: ['file.compressFiles', 'file.compressionFormat'] },
};
