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
        fields: ['export.newegg.method', 'export.newegg.methodConfig'],
        type: 'collapse',
      },
    ],
  },
};
