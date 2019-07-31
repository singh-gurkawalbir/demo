export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'returnly',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.returnly.com/`,
    '/rest/pingRelativeURI': '/returns.json',
    '/rest/headers': [
      {
        name: 'X-Api-Token',
        value: '{{{connection.rest.encrypted.apiKey}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      label: 'API Key:',
      required: true,
      type: 'text',
      inputType: 'password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Summary tab in Your Account section.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
