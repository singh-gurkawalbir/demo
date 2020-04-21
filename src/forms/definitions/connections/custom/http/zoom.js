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
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
