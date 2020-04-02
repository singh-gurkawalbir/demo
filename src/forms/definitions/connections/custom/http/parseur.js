export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'parseur',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.parseur.com`,
    '/http/ping/relativeURI': '/parser',
    '/http/ping/method': 'GET',
    '/http/headers': [
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'Authorization',
        value: 'Token {{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'API token key',
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
