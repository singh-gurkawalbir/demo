export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'klaviyo',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://a.klaviyo.com/api/',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI':
      '/v1/lists?api_key={{{connection.http.encrypted.apiKey}}}',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      type: 'text',
      label: 'API key',
      defaultValue: '',
      required: true,
      inputType: 'password',
      helpKey: 'klaviyo.connection.http.encrypted.apiKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
