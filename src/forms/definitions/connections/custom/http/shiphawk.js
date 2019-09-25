export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shiphawk',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://shiphawk.com/api`,
    '/http/ping/relativeURI': '/v4/orders/',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'x-api-key',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API Key',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      required: true,
      helpText:
        'The API Key of your ShipHawk account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API Key safe. This can be obtained from the Settings section and API Key subsection.',
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
