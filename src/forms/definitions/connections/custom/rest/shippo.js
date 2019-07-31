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
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. You can find your token on the Shippo API settings page.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
