export default {
  fieldMap: {
    'http.disableStrictSSL': { fieldId: 'http.disableStrictSSL' },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'http.concurrencyLevel': { fieldId: 'http.concurrencyLevel' },
    'clientCertificates.cert': { fieldId: 'clientCertificates.cert' },
    'clientCertificates.key': { fieldId: 'clientCertificates.key' },
    'http.clientCertificates.passphrase': {
      fieldId: 'http.clientCertificates.passphrase',
    },
  },
  layout: {
    fields: [
      'http.disableStrictSSL',
      '_borrowConcurrencyFromConnectionId',
      'http.concurrencyLevel',
      'clientCertificates.cert',
      'clientCertificates.key',
      'http.clientCertificates.passphrase',
    ],
  },
};
