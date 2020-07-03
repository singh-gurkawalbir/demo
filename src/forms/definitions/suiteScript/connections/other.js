export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'other.hostURI': { fieldId: 'other.hostURI' },
    'other.username': { fieldId: 'other.username' },
    'other.password': { fieldId: 'other.password' },
  },
  layout: {
    fields: ['name', 'other.hostURI', 'other.username', 'other.password'],
    type: 'collapse',
  },
};
