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
      helpText: 'The subscription key of your Tesco account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
