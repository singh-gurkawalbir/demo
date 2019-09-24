export default {
  fieldMap: {
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      required: true,
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      required: true,
    },
  },
  layout: { fields: ['rest.basicAuth.username', 'rest.basicAuth.password'] },
};
