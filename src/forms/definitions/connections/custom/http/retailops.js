export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'retailops',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.retailops.com',
    '/http/ping/relativeURI': '/product/sku/get~1.json',
    '/http/ping/method': 'POST',
    '/http/ping/body': JSON.stringify({ sku_string: '1' }),
    '/http/ping/successPath': 'success',
    '/http/ping/successValues': '1',
    '/http/headers': [
      { name: 'content-type', value: 'application/json' },
      {
        name: 'apikey',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API key',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'retailops.connection.http.encrypted.apiKey',
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
        fields: ['http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
