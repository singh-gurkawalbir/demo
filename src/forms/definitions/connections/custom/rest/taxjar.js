export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'taxjar',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/categories',
    '/rest/baseURI': `https://api.taxjar.com`,
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
    '/rest/authScheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      label: 'API Key:',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
