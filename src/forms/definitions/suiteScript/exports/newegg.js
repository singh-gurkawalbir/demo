export default {
  fieldMap: {
    'export.newegg.method': {
      fieldId: 'export.newegg.method',
    },
    'export.newegg.methodConfig': {
      fieldId: 'export.newegg.methodConfig',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'What would you like to export?',
            fields: ['export.newegg.method', 'export.newegg.methodConfig'],
          }
        ],
      },
    ],
  },
};
