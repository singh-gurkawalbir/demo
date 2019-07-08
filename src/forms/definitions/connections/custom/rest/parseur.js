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
      inputType: 'password',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'API Token Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
