export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'shippo',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.goshippo.com`,
    '/rest/pingRelativeURI': '/addresses',
    '/rest/pingMethod': 'GET',
    '/rest/headers': [
      {
        name: 'Authorization',
        value: 'ShippoToken {{{connection.rest.encrypted.token}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.token',
      label: 'API Token:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
