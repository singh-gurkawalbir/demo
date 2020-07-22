export default {
  fieldMap: {
    'export.file.method': {fieldId: 'export.file.method'},
    'export.file.csv': {fieldId: 'export.file.csv'},
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'How would you like to parse files?',
            collapsed: false,
            type: 'indent',
            containers: [{
              fields: [
                'export.file.csv',
              ]
            }],
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
