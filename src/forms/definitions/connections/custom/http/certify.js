export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'certify',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/expensereports',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.certify.com',
    '/http/headers': [
      { name: 'x-api-key', value: '{{{connection.http.encrypted.apiKey}}}' },
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'x-api-secret',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      defaultValue: '',
      required: true,
      type: 'text',
      label: 'API key',
      inputType: 'password',
      helpKey: 'certify.connection.http.encrypted.apiKey',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      defaultValue: '',
      required: true,
      type: 'text',
      label: 'API secret',
      inputType: 'password',
      helpKey: 'certify.connection.http.encrypted.apiSecret',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.encrypted.apiKey', 'http.encrypted.apiSecret'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
