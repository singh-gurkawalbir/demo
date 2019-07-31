export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'pulseway',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/systems',
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
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
