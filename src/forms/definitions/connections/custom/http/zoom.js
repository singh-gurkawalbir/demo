export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zoom',
    '/http/auth/type': 'jwt',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.zoom.us',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      helpKey: 'zoom.connection.http.encrypted.apiKey',
      label: 'API key',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API secret',
      helpKey: 'zoom.connection.http.encrypted.apiSecret',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.encrypted.apiKey', 'http.encrypted.apiSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
