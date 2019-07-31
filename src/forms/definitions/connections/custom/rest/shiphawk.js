export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'shiphawk',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://shiphawk.com/api`,
    '/rest/pingRelativeURI': '/v4/orders/',
    '/rest/headers': [
      {
        name: 'x-api-key',
        value: '{{{connection.rest.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      label: 'API Key:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText: 'The API Key of your ShipHawk account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
