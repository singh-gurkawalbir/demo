export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'yammer',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.yammer.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.yammer.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://www.yammer.com/oauth2/access_token',
    '/rest/scopeDelimiter': ' ',
    '/rest/oauth/accessTokenPath': 'access_token.token',
  }),
  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
