export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'hybris',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.beta.yaas.io/hybris',
    '/rest/authURI': 'https://api.beta.yaas.io/hybris/oauth2/v1/authorize',
    '/rest/oauthTokenURI': 'https://api.beta.yaas.io/hybris/oauth2/v1/token',
    '/rest/scopeDelimiter': ',',
    '/rest/scope': ['hybris.no_tenant'],
    '/rest/tokenLocation': 'header',
  }),

  fields: [
    { fieldId: 'name' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
