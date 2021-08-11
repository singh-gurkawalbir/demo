export default {
  fieldMap: {
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      required: true,
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      required: true,
    },
  },
  layout: { fields: ['http.auth.basic.username', 'http.auth.basic.password'] },
};
