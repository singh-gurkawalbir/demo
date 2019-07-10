export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'squareup',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/locations',
    '/rest/baseURI': `https://connect.squareup.com`,
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
    '/rest/authScheme': 'Bearer',
    '/rest/pingSuccessPath': 'locations',
  }),
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      label: 'Access Token:',
      required: true,
      helpText:
        'Enter your access token for Square here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
