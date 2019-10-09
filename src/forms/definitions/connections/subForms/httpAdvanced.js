export default {
  fieldMap: {
    'http.disableStrictSSL': { fieldId: 'http.disableStrictSSL' },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'http.concurrencyLevel': { fieldId: 'http.concurrencyLevel' },
  },
  layout: {
    fields: [
      'http.disableStrictSSL',
      '_borrowConcurrencyFromConnectionId',
      'http.concurrencyLevel',
    ],
  },
};
