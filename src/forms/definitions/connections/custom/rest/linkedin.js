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
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
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
