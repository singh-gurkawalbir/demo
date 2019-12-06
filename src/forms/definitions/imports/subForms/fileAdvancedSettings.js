export default {
  fieldMap: {
    'file.skipAggregation': {
      fieldId: 'file.skipAggregation',
    },
    'file.compressFiles': {
      id: 'file.compressFiles',
      type: 'checkbox',
      label: 'Compress Files',
      defaultValue: r => !!(r && r.file && r.file.compressionFormat),
    },
    'file.compressionFormat': {
      fieldId: 'file.compressionFormat',
      visibleWhen: [
        {
          field: 'file.compressFiles',
          is: [true],
        },
      ],
      requiredWhen: [{ field: 'file.compressFiles', is: [true] }],
    },
    'file.csv.wrapWithQuotes': {
      fieldId: 'file.csv.wrapWithQuotes',
    },
    'file.csv.replaceTabWithSpace': {
      fieldId: 'file.csv.replaceTabWithSpace',
    },
    'file.csv.replaceNewLineWithSpace': {
      fieldId: 'file.csv.replaceNewLineWithSpace',
    },
  },
  layout: {
    fields: [
      'file.skipAggregation',
      'file.compressFiles',
      'file.compressionFormat',
      'file.csv.wrapWithQuotes',
      'file.csv.replaceTabWithSpace',
      'file.csv.replaceNewLineWithSpace',
    ],
  },
};
