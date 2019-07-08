export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'yahoo',
    '/rest/baseURI': 'https://api.login.yahoo.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.login.yahoo.com/oauth2/request_auth',
    '/rest/oauthTokenURI': 'https://api.login.yahoo.com/oauth2/get_token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [{ fieldId: 'name' }],
};
