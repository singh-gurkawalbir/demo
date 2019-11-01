export default {
  fieldMap: {
    'file.skipAggregation': {
      fieldId: 'file.skipAggregation',
    },
    compressFiles: {
      id: 'file.compressFiles',
      type: 'checkbox',
      label: 'Compress Files',
    },
    'file.compressionFormat': {
      fieldId: 'file.compressionFormat',
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
      'compressFiles',
      'file.csv.wrapWithQuotes',
      'file.csv.replaceTabWithSpace',
      'file.csv.replaceNewLineWithSpace',
    ],
  },
};
