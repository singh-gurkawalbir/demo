export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'asana',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/1.0/users',
    '/rest/baseURI': 'https://app.asana.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'Personal Access Token:',
      helpText:
        'Enter your personal access token.\n\n Note: There are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
