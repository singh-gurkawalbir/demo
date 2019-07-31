export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'aptrinsic',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v1/users',
    '/rest/baseURI': 'https://api.aptrinsic.com/',
    '/rest/headers': [
      {
        name: 'X-APTRINSIC-API-KEY',
        value: '{{{connection.rest.encrypted.apiKey}}}',
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

      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from Account Settings in REST API section.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
