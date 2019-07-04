export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/auth/whoami',
    '/type': 'rest',
    '/assistant': 'fieldaware',
    '/rest/baseURI': 'https://api.fieldaware.net',
    '/rest/headers': [
      {
        name: 'Authorization',
        value: 'Token {{{connection.rest.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Accept', value: 'application/json' },
    ],
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      required: true,
      label: 'API Key:',
    },
  ],
};
