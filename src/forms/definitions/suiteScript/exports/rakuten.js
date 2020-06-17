export default {
  fieldMap: {
    exportData: { fieldId: 'exportData' },
    'export.file.method': {
      fieldId: 'export.file.method',
    },
    'export.file.csv': {
      fieldId: 'export.file.csv',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: ['exportData', 'export.file.method', 'export.file.csv'],
        type: 'collapse',
      },
    ],
  },
};
