export default {
  fieldMap: {
    fileMetadata: {
      id: 'fileMetadata',
      type: 'checkbox',
      label: 'File metadata only',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['blob'],
        },
      ],
      defaultValue: r => r && r.file && r.file.output === 'metadata',
    },
    'file.decompressFiles': {
      id: 'file.decompressFiles',
      type: 'checkbox',
      label: 'Decompress files',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'file.output',
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
    skipRetries: {
      fieldId: 'skipRetries',
    },
    apiIdentifier: { fieldId: 'apiIdentifier' },
  },
  layout: {
    fields: [
      'fileMetadata',
      'file.decompressFiles',
      'file.compressionFormat',
      'file.skipDelete',
      'file.encoding',
      'pageSize',
      'dataURITemplate',
      'skipRetries',
      'apiIdentifier',
    ],
  },
};
