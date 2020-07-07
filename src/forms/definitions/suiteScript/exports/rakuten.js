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
        type: 'collapse',
        containers: [
          {
            label: 'How would you like to parse files?',
            fields: [
              'export.file.csv'
            ],
            collapsed: false,
          },
          {
            label: 'Where would you like to transfer from?',
            fields: ['export.file.method'],
            collapsed: false,
          },
        ],
      },
    ],
  },
};
