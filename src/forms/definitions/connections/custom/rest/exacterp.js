export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'exacterp',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/rest/baseURI': 'https://start.exactonline.com',
    '/rest/authURI': 'https://start.exactonline.com/api/oauth2/auth',
    '/rest/oauthTokenURI': 'https://start.exactonline.com/api/oauth2/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/tokenLocation': 'header',
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
