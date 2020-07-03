export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'newegg.username': { fieldId: 'newegg.username' },
    'newegg.password': { fieldId: 'newegg.password' },
    'newegg.securityKey': { fieldId: 'newegg.securityKey' },
  },
  layout: {
    fields: [
      'name',
      'newegg.username',
      'newegg.password',
      'newegg.securityKey',
    ],
    type: 'collapse',
  },
};
