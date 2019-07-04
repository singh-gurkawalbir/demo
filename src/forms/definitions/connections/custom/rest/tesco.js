export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'tesco',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/grocery/products/?query=name&offset=0&limit=10',
    '/rest/baseURI': `https://dev.tescolabs.com`,
    '/rest/headers': [
      {
        name: 'Ocp-Apim-Subscription-Key',
        value: '{{{connection.rest.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },

    {
      id: 'rest.encrypted.apiKey',
      label: 'Ocp Apim Subscription Key:',
      required: true,
      type: 'text',
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
