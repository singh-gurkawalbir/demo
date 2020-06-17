export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'rakuten.username': { fieldId: 'rakuten.username' },
    'rakuten.password': { fieldId: 'rakuten.password' },
  },
  layout: {
    fields: ['name', 'rakuten.username', 'rakuten.password'],
    type: 'collapse',
  },
};
