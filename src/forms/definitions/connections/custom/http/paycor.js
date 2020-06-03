export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'paycor',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://secure.paycor.com',
    '/http/ping/relativeURI': 'Documents/api/documents/customreport',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.publicKey': {
      id: 'http.unencrypted.publicKey',
      type: 'text',
      label: 'Public key',
      helpKey: 'paycor.connection.http.unencrypted.publicKey',
      required: true,
    },
    'http.encrypted.secretKey': {
      id: 'http.encrypted.secretKey',
      type: 'text',
      label: 'Private key',
      defaultValue: '',
      required: true,
      inputType: 'password',
      helpKey: 'paycor.connection.http.encrypted.secretKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.unencrypted.publicKey', 'http.encrypted.secretKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
