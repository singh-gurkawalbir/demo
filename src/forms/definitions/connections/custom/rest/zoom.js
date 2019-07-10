export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zoom',
    '/rest/authType': 'jwt',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/users',
    '/rest/baseURI': 'https://api.zoom.us',
  }),

  fields: [
    { fieldId: 'name' },

    {
      id: 'rest.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your zoom account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your zoom account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
