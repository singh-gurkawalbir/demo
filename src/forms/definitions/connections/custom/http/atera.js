export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'atera',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v3/customers',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://app.atera.com/api',
    '/http/headers': [
      {
        name: 'X-API-KEY',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      type: 'text',
      helpKey: 'atera.connection.http.encrypted.apiKey',
      inputType: 'password',
      defaultValue: '',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
