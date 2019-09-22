export default {
  fieldMap: {
    type: { fieldId: 'type' },
    name: { fieldId: 'name' },
    'wrapper.unencrypted': { fieldId: 'wrapper.unencrypted' },
    'wrapper.unencrypteds': { fieldId: 'wrapper.unencrypteds' },
    'wrapper.encrypted': { fieldId: 'wrapper.encrypted' },
    'wrapper.encrypteds': { fieldId: 'wrapper.encrypteds' },
    'wrapper.pingFunction': { fieldId: 'wrapper.pingFunction' },
    'wrapper._stackId': { fieldId: 'wrapper._stackId' },
    'wrapper.concurrencyLevel': { fieldId: 'wrapper.concurrencyLevel' },
  },
  layout: {
    fields: [
      'type',
      'name',
      'wrapper.unencrypted',
      'wrapper.unencrypteds',
      'wrapper.encrypted',
      'wrapper.encrypteds',
      'wrapper.pingFunction',
      'wrapper._stackId',
      'wrapper.concurrencyLevel',
    ],
  },
};
