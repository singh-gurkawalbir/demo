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
        fields: ['export.sears.method', 'export.sears.methodConfig'],
        type: 'collapse',
      },
    ],
  },
};
