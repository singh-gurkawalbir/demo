export default {
  preSubmit: formValues => ({
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

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      required: true,
      label: 'API Key',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained by reaching out to FieldAware support team.',
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
