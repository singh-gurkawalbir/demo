export default {
  fieldMap: {
    'export.sears.method': {
      fieldId: 'export.sears.method',
    },
    'export.sears.methodConfig': {
      fieldId: 'export.sears.methodConfig',
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
            fields: ['export.sears.method', 'export.sears.methodConfig'],
          }
        ],
      },
    ],
  },
};
