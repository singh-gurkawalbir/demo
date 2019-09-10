export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sageone',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI':
      'https://api.columbus.sage.com/countryCode/sageone/accounts/v3/',
    '/http/auth/oauth/authURI': 'https://www.sageone.com/oauth2/auth/central',
    '/http/auth/oauth/tokenURI': 'https://api.sageone.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/scope': ['full_access'],
    '/http/headers': [
      {
        name: 'X-Site',
        value: '{{{connection.http.encrypted.resourceOwnerId}}}',
      },
    ],
  }),
  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
