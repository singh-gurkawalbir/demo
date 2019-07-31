export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'steelbrick',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://login.salesforce.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://login.salesforce.com/services/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://login.salesforce.com/services/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
