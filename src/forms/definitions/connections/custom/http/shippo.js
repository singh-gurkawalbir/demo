export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shippo',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.goshippo.com',
    '/http/ping/relativeURI': '/addresses',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Authorization',
        value: 'ShippoToken {{{connection.http.encrypted.token}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.token': {
      id: 'http.encrypted.token',
      label: 'API token',
      helpKey: 'shippo.connection.http.encrypted.token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
