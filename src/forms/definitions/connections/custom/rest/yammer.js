export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'yammer',
    '/rest/baseURI': 'https://www.yammer.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.yammer.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://www.yammer.com/oauth2/access_token',
    '/rest/scopeDelimiter': ' ',
    '/rest/oauth/accessTokenPath': 'access_token.token',
  }),
  fields: [{ fieldId: 'name' }],
};
