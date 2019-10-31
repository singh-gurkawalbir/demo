export default {
  fieldMap: {
    'file.decompressFiles': {
      id: 'file.decompressFiles',
      type: 'checkbox',
      label: 'Decompress Files',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => !!(r && r.file && r.file.compressionFormat),
    },
    'file.compressionFormat': {
      fieldId: 'file.compressionFormat',
      visibleWhen: [{ field: 'file.decompressFiles', is: [true] }],
    },
    'file.skipDelete': { fieldId: 'file.skipDelete' },
    'file.encoding': { fieldId: 'file.encoding' },
    pageSize: {
      fieldId: 'pageSize',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: {
    fields: [
      'file.decompressFiles',
      'file.compressionFormat',
      'file.skipDelete',
      'file.encoding',
      'pageSize',
      'dataURITemplate',
    ],
  },
};
