export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'linkedin',
    '/rest/baseURI': 'https://api.linkedin.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.linkedin.com/oauth/v2/authorization',
    '/rest/oauthTokenURI': 'https://www.linkedin.com/oauth/v2/accessToken',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'r_basicprofile',
        'r_emailaddress',
        'rw_company_admin',
        'w_share',
      ],
    },
  ],
};
