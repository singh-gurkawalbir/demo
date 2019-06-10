export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/systems',
    '/assistant': 'pulseway',
    '/type': 'rest',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      helpText:
        'Please enter baseURI of your Pulseway account. If you host your own Pulseway Enterprise Server, use “https://your-server-name/api” as base URL.',
    },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
