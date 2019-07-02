export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/type': 'rest',
    '/assistant': 'exacterp',
    '/rest/baseURI': 'https://start.exactonline.com',
    '/rest/authURI': 'https://start.exactonline.com/api/oauth2/auth',
    '/rest/oauthTokenURI': 'https://start.exactonline.com/api/oauth2/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/tokenLocation': 'header',
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'API Key:',
    },
  ],
};
