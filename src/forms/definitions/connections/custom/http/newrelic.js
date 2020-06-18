export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'newrelic',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.newrelic.com',
    '/http/ping/relativeURI': '/v2/applications.json',
    '/http/ping/method': 'GET',
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
      label: 'API key',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'newrelic.connection.http.encrypted.apiKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
