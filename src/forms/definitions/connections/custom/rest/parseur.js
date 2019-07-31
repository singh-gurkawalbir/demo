export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'parseur',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.parseur.com`,
    '/rest/pingRelativeURI': '/parser',
    '/rest/headers': [
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'Authorization',
        value: 'Token {{{connection.rest.encrypted.apiKey}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      label: 'API Token Key:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
