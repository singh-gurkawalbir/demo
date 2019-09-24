export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
