export default {
  fieldMap: {
    restlet: {
      formId: 'restlet',
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: ['restlet'],
        type: 'collapse',
      },
    ],
  },
};
