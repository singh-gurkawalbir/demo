export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'magento.hostURI': { fieldId: 'magento.hostURI' },
    'magento.username': { fieldId: 'magento.username' },
    'magento.password': { fieldId: 'magento.password' },
  },
  layout: {
    fields: ['name', 'magento.hostURI', 'magento.username', 'magento.password'],
    type: 'collapse',
  },
};
