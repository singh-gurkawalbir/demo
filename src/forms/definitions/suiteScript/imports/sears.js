export default {
  fieldMap: {
    'import.sears.method': {
      fieldId: 'import.sears.method',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'How would you like the records imported?',
            fields: ['import.sears.method'],
          }
        ],
      },
    ],
  },
};
