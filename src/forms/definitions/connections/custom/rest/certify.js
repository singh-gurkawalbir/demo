export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'certify',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v1/expensereports',
    '/rest/baseURI': 'https://api.certify.com',
    '/rest/headers': [
      { name: 'x-api-key', value: '{{{connection.rest.encrypted.apiKey}}}' },
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'x-api-secret',
        value: '{{{connection.rest.encrypted.apiSecret}}}',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },

    {
      id: 'rest.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your Certify account.',
    },
    {
      id: 'rest.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },
  ],
};
