export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'easypost',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/addresses',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.easypost.com/v2`,
    '/rest/basicAuth/password': '',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      inputType: 'password',
      helpKey: 'easypost.apiKey',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
