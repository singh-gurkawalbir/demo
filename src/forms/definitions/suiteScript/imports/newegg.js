export default {
  fieldMap: {
    'import.newegg.method': {
      fieldId: 'import.newegg.method',
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
            fields: ['import.newegg.method'],
          }
        ],
      },
    ],
  },
};
