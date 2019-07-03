export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'box',
    '/rest/baseURI': 'https://api.box.com',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
    '/rest/authURI': 'https://account.box.com/api/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://api.box.com/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),

  fields: [{ fieldId: 'name' }],
};
