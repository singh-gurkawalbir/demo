export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'sears.sellerId': { fieldId: 'sears.sellerId' },
    'sears.username': { fieldId: 'sears.username' },
    'sears.password': { fieldId: 'sears.password' },
  },
  layout: {
    fields: ['name', 'sears.sellerId', 'sears.username', 'sears.password'],
    type: 'collapse',
  },
};
