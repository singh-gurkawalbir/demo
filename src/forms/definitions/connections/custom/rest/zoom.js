export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'jwt',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/users',
    '/type': 'rest',
    '/assistant': 'zoom',
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
