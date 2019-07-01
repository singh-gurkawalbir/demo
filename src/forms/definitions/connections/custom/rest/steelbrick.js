export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'steelbrick',
    '/rest/baseURI': 'https://login.salesforce.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://login.salesforce.com/services/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://login.salesforce.com/services/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [{ fieldId: 'name' }],
};
