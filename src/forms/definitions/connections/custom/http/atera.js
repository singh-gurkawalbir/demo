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
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained by Navigating to Admin >> API from the left hand panel.',
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
