export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'fieldaware',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/auth/whoami',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.fieldaware.net',
    '/http/headers': [
      {
        name: 'Authorization',
        value: 'Token {{{connection.http.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Accept', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      fieldId: 'http.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      required: true,
      label: 'API key',
      helpKey: 'fieldaware.connection.http.encrypted.apiKey',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
