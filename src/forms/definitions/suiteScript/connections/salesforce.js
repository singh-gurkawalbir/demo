export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'salesforce.username': { fieldId: 'salesforce.username' },
    'salesforce.password': { fieldId: 'salesforce.password' },
    'salesforce.securityKey': { fieldId: 'salesforce.securityKey' },
    'salesforce.sandbox': { fieldId: 'salesforce.sandbox' },
  },
  layout: {
    fields: [
      'name',
      'salesforce.username',
      'salesforce.password',
      'salesforce.securityKey',
      'salesforce.sandbox',
    ],
    type: 'collapse',
  },
};
