export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      label: 'API Key',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      required: true,
      helpText: 'The API Key of your ShipHawk account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
