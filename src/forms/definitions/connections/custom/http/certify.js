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
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your Certify account.',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      defaultValue: '',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.apiKey', 'http.encrypted.apiSecret'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
