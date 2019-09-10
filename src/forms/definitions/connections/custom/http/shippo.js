export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shippo',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.goshippo.com`,
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
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.token',
      label: 'API Token:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. You can find your token on the Shippo API settings page.',
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
