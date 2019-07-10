export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'tophatter',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/products.json',
    '/rest/baseURI': `https://tophatter.com/merchant_api/v1`,
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': 'access_token',
  }),
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      label: 'Access Token:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
