export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'sageone',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI':
      'https://api.columbus.sage.com/countryCode/sageone/accounts/v3/',
    '/rest/authURI': 'https://www.sageone.com/oauth2/auth/central',
    '/rest/oauthTokenURI': 'https://api.sageone.com/oauth2/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/scope': ['full_access'],
    '/rest/headers': [
      {
        name: 'X-Site',
        value: '{{{connection.rest.encrypted.resourceOwnerId}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
