export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'returnly',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.returnly.com/',
    '/http/ping/relativeURI': '/returns.json',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'X-Api-Token',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      {
        name: 'X-Api-Version',
        value: '{{{connection.http.unencrypted.version}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API key',
      defaultValue: '',
      required: true,
      type: 'text',
      helpKey: 'returnly.connection.http.encrypted.apiKey',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.unencrypted.version': {
      fieldId: 'http.unencrypted.version',
      type: 'text',
      label: 'Version',
      helpKey: 'returnly.connection.http.unencrypted.version',
      required: true,
      defaultValue: r => (r && r.http && r.http.unencrypted && r.http.unencrypted.version) ||
      '2020-08',
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
        fields: ['http.encrypted.apiKey', 'http.unencrypted.version'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
