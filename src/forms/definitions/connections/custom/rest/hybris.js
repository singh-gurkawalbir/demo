export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'hybris',
    '/rest/baseURI': 'https://api.beta.yaas.io/hybris',
    '/rest/authURI': 'https://api.beta.yaas.io/hybris/oauth2/v1/authorize',
    '/rest/oauthTokenURI': 'https://api.beta.yaas.io/hybris/oauth2/v1/token',
    '/rest/scopeDelimiter': ',',
    '/rest/scope': ['hybris.no_tenant'],
    '/rest/tokenLocation': 'header',
  }),

  fields: [{ fieldId: 'name' }],
};
