export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'nimble',
    '/rest/baseURI': 'https://api.nimble.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.nimble.com/oauth/authorize',
    '/rest/oauthTokenURI': 'https://api.nimble.com/oauth/token',
    '/rest/scopeDelimiter': ',',
  }),
  fields: [{ fieldId: 'name' }],
};
