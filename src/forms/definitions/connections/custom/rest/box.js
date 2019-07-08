export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'box',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.box.com',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
    '/rest/authURI': 'https://account.box.com/api/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://api.box.com/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),

  fields: [{ fieldId: 'name' }],
};
